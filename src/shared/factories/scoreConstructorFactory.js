angular.module('highScoreApp')
  .factory('scoreConstructorFactory', (apiFactory, userDataFactory) => {
    /**
     * Constructor that accepts JSON data about a highscore, appends any config details, changes date strings to js Date() and returns the HighScoreObj
     ***/
    return class HighScore {
      constructor(properties) {
        properties.currentScore = +properties.currentScore || 0;
        properties.id = +properties.id || _uniqueId();
        _newScore(properties);
        this.data = properties;
      }
      /**
       * save the updated object attributes
       ***/
      saveObj(properties) {
        //extend the highScore object with the new properties
        this.data = Object.assign(this.data, properties);
        if (properties.currentScore) _newScore(this.data);
        ////update local storage
        userDataFactory.scores = userDataFactory.scores;
      }
      /***
       * gets additional score information from API, sets new score
       ***/
      pullScore() {
        let metaData = this.data.metaData && this.data.metaData.queryParams ? this.data.metaData.queryParams : undefined;
        return apiFactory.scoreRequest(this.data.apiInfo.provider, this.data.apiInfo.path, metaData).then((res) =>
            this.saveObj({
              currentScore: +res.data.score,
              metaData: res.data.metaData
            })
        );
      }
      /***
       * increment an object based on it's incrementValue, return an error if the object should not be incremented
       ***/
      increment(amount) {
        let increment = amount === 'down' ? -this.data.config.incrementValue : this.data.config.incrementValue;
        this.saveObj({
          currentScore: increment + this.currentScore
        });
      }
    };
    /***
     * generate unique Ids for new custom scores
     * not sure why i might need ids but its prob a good idea to assign them early on in case....
     ***/
    function _uniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
    /**
     * cleanse data being added/created
     * adds score specific data (highScore, history)
     * converts history data to the proper format
     ***/
    function _newScore(data) {
      const historyDataPoint = {
        date: new Date(),
        score: data.currentScore
      };
      data.history = data.history ? data.history.concat([historyDataPoint]) : [historyDataPoint];
      //update highScore if applicable
      if (data.currentScore >= (data.highScore || data.currentScore))
        data.highScore = data.currentScore;
    }
  });
