angular.module('highScoreApp')
  .factory('scoreConstructorFactory', (apiFactory, userDataFactory, scoresFactory) => {
    /***
     * Factory Returned Functions
     ***/
    return {
      newScore
    };

    function newScore(properties) {
      return new HighScore(properties);
    }
    /**
     * Constructor that accepts JSON data about a highscore, appends any config details, changes date strings to js Date() and returns the HighScoreObj
     ***/
    class HighScore {
      constructor(properties) {
        properties.currentScore = +properties.currentScore || 0;
        properties.id = +properties.id || _uniqueId();
        _newScore(properties);

        Object.assign(this, properties);
      }
      /**
       * save the updated object attributes
       ***/
      saveObj(properties) {
        //extend the highScore object with the new properties
        Object.assign(this, properties);
        if (properties.currentScore) _newScore(this);
        userDataFactory.scores = scoresFactory.getScores();
      }
      /***
       * gets additional score information from API, sets new score
       ***/
      pullScore() {
        let metaData = this.metaData && this.metaData.queryParams ? this.metaData.queryParams : undefined;
        return apiFactory.scoreRequest(this.apiInfo.provider, this.apiInfo.path, metaData).then((res) =>
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
        let increment = amount === 'down' ? -this.config.incrementValue : this.config.incrementValue;
        this.saveObj({
          currentScore: increment + this.currentScore
        });
      }
    }
    /***
     * generate unique Ids for new custom scores
     * not sure why i might need ids but its prob a good idea to assign them early on in case....
     ***/
    function _uniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        v.toString(16);
      });
    }

    /**
     * cleanse data being added/created
     * adds score specific data (highScore, history)
     * converts history data to the proper format
     ***/
    function _newScore(highScore) {
      if (Number.isFinite(highScore)) throw 'errr';

      const historyDataPoint = {
        date: new Date(),
        score: highScore.currentScore
      };
      highScore.history = highScore.history ? highScore.history.concat([historyDataPoint]) : [historyDataPoint];
      //update highScore if applicable
      if (highScore.currentScore >= (highScore.highScore || highScore.currentScore))
        highScore.highScore = highScore.currentScore;
    }
  });
