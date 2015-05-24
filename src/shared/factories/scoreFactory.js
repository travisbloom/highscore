angular.module('highScoreApp')
  .factory('scoreFactory', (userDataFactory, apiFactory) => {
    //captures all the constructed HighScoreObj's
    let highScoreArray;
    /**
     * cleanse data being added/created
     * adds score specific data (highScore, history)
     * converts history data to the proper format
     ***/
    function prepareScoreProperties(properties) {
      //if a new score is being added
      if (!isNaN(properties.currentScore)) {
        const historyDataPoint = {
          date: new Date(),
          score: properties.currentScore
        };
        if (this.history) {
          //if a new history record is being inserted and the previous record was less than 4 seconds old, override the oldest data point
          //todo do I need this?
          //if ((currentTime - this.history[this.history.length - 1].date < 4000))
          //  properties.history = this.history.pop();
          //create the object with the new fields to be sent to saveObj()
          properties.history = this.history.concat([historyDataPoint]);
        } else {
          properties.history = [historyDataPoint]
        }
        //update highScore if applicable
        if (properties.currentScore >= (this.highScore || properties.currentScore))
          properties.highScore = properties.currentScore;
      }
      return properties;
    }
    /**
     * Constructor that accepts JSON data about a highscore, appends any config details, changes date strings to js Date() and returns the HighScoreObj
     ***/
    class HighScoreObj {
      constructor(obj) {
        Object.assign(this, obj);
      }
      /**
       * save the updated object attributes
       ***/
      saveObj(obj) {
        let userData = userDataFactory.data;
        //index of object
        const index = userData.scores.map((score) => score.id).indexOf(this.id);
        //append/cleanse properties being added
        obj = prepareScoreProperties.bind(this, obj)();
        //extend the highScore object with the new properties
        Object.assign(this, obj);
        //extend the userData object with the new properties
        Object.assign(userData.scores[index], obj);
        //save new story data
        userDataFactory.data = userData;
      }
      /**
       * delete score
       ***/
      removeScore() {
        let userData = userDataFactory.data;
        //index of object
        const index = userData.scores.map((score) => score.id).indexOf(this.id);
        //remove it from existing custom scores
        if (this.apiInfo) userData.usedCustomScores.splice(userData.usedCustomScores.indexOf(this.apiInfo.path), 1);
        userData.scores.splice(index, 1);
        highScoreArray.splice(index, 1);
        userDataFactory.data = userData;
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
    function uniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        v.toString(16);
      });
    }
    /***
     * Factory Returned Functions
     ***/
    return {
      newScore(obj) {
        let userData = userDataFactory.data;
        obj.currentScore = +obj.currentScore || 0;
        obj.id = +obj.id || uniqueId();
        obj = prepareScoreProperties.bind(obj, obj)();
        //add the custom score path to the list of used 3rd party scores
        if (obj.apiInfo) userData.usedCustomScores.push(obj.apiInfo.path);
        //if the application has already generated the highScores array
        if (highScoreArray) highScoreArray.push(new HighScoreObj(obj));
        //add and save the new score to savedScores
        userData.scores.push(obj);
        userDataFactory.data = userData;
      },
      reorderScores(fromIndex, toIndex) {
        //save new story data
        let userData = userDataFactory.data;
        userData.scores.splice(toIndex, 0, userData.scores.splice(fromIndex, 1)[0]);
        userDataFactory.data = userData;
        //update highScore Array
        highScoreArray.splice(toIndex, 0, highScoreArray.splice(fromIndex, 1)[0]);
        return highScoreArray;
      },
      /***
       * returns the constructed HighScore Objects if they already exist or query for saved data and then construct the array
       ***/
      getScores() {
        if (highScoreArray) return highScoreArray;
        //get saved stories
        return highScoreArray = userDataFactory.data.scores.map((savedScore) =>  new HighScoreObj(savedScore));
      }
    };
  });
