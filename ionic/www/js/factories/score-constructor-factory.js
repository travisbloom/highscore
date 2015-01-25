angular.module('highScoreApp')
  .factory('highScoreFactory', function(localFactory, thirdPartyFactory) {
    //captures all the constructed HighScoreObj's
    var highScoreArray;
    /**
     * Converts time stamps back and forth from JSON time and Date() time
     ***/
    function convertHistory(history) {
      return history.map(function (datapoint) {
        return {
          score: datapoint.score,
          date: typeof datapoint.date === 'string' ? new Date(datapoint.date) : datapoint.date.toJSON()
        }
      });
    }
    /**
     * Constructor that accepts JSON data about a highscore, appends any config details, changes date strings to js Date() and returns the HighScoreObj
     ***/
    function HighScoreObj (refObj) {
      var self = this;
      Object.keys(refObj).forEach(function (key) {
        //if the key is the history array, convert the time stamps
        if (key === 'history') {
          self.history = convertHistory(refObj.history);
        } else {
          //add the json properties to the new obj
          self[key] = refObj[key];
        }
      });
    }
    /**
     * save the updated object attributes
     ***/
    HighScoreObj.prototype.saveObj = function (params) {
      var self = this, index, appData = localFactory.appData;
      //index of object
      index = appData.scores.map(function(score) { return score.id; }).indexOf(this.id);
      Object.keys(params).forEach(function(key) {
        //if a new history is being saved, convert the js Date() to JSON first
        var newVal = key === 'history' ? convertHistory(params.history) : params[key];
        self[key] = newVal;
        appData.scores[index][key] = newVal;
      });
      //save new story data
      localFactory.appData = appData;
    };
    /***
     * updates the current score, adds the new score to the history array, and updates high score if applicable
     ***/
    HighScoreObj.prototype.newScore = function (score) {
      var currentTime = new Date(), params;
      if (isNaN(score))
        throw 'scores must be numbers';
      //if a new history record is being inserted and the previous record was less than 10 seconds old, override the oldest data point
      if (currentTime - this.history[this.history.length - 1].date < 10000)
        this.history.pop();
      //create the object with the new fields to be sent to saveObj()
      params = {
        currentScore: score,
        history: this.history.concat([{
          date: currentTime,
          score: score
        }])
      };
      //update highScore if applicable
      if (score > this.highScore)
        params.highScore = score;
      this.saveObj(params);
    };
    /***
     * gets additional score information from API, sets new score
     ***/
    HighScoreObj.prototype.pullScore = function () {
      var score = this, metaData = this.metaData && this.metaData.queryParams ? this.metaData.queryParams : undefined;
      return thirdPartyFactory.scoreRequest(this.apiInfo.provider, this.apiInfo.path, metaData).then(function(res) {
        score.saveObj({metaData: res.data.metaData});
        score.newScore(res.data.score);
      });
    };
    /***
     * increment an object based on it's incrementValue, return an error if the object should not be incremented
     ***/
    HighScoreObj.prototype.increment = function (amount) {
      if (amount === 'down')
        return this.newScore(-this.incrementValue + this.currentScore);
      //default to adding the increment value
      return this.newScore(this.incrementValue + this.currentScore);
    };
    /***
    * generate unique Ids for new custom scores
    ***/
    function uniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
    /***
     * Factory Returned Functions
     ***/
    return {
      newScore: function (scoreInfo) {
        scoreInfo.currentScore = scoreInfo.currentScore || 0;
        //define defaults
        var appData, score = {
          //id is passed for 3rd party options
          id: scoreInfo.id || uniqueId(),
          currentScore: scoreInfo.currentScore,
          highScore: scoreInfo.currentScore,
          config: scoreInfo.config,
          history: [{
            date: new Date().toJSON(),
            score: scoreInfo.currentScore
          }]
        };
        if (scoreInfo.apiInfo) score.apiInfo = scoreInfo.apiInfo;
        if (scoreInfo.metaData) score.metaData = scoreInfo.metaData;
        //if the application has already generated the highScores array
        if (highScoreArray) highScoreArray.push(new HighScoreObj(score));
        //add and save the new score to savedScores
        appData = localFactory.appData;
        appData.scores.push(score);
        localFactory.appData = appData;
      },
      reorderScores: function (fromIndex, toIndex) {
        var appData = localFactory.appData;
        appData.scores.splice(toIndex, 0, newScores.splice(fromIndex, 1)[0]);
        //save new story data
        localFactory.appData = appData;
        highScoreArray.splice(toIndex, 0, highScoreArray.splice(fromIndex, 1)[0]);
        return highScoreArray;
      },
      /***
       * returns the constructed HighScore Objects if they already exist or query for saved data and then construct the array
       ***/
      getScores: function() {
        if (highScoreArray) return highScoreArray;
        //get saved stories
        return highScoreArray = localFactory.appData.scores.map(function(savedScore) {
          return new HighScoreObj(savedScore);
        });
      }
    };
  });
