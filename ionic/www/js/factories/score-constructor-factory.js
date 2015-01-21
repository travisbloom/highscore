angular.module('starter')
  .factory('highScoreFactory', function(authFactory, localFactory) {
    var setTypes = {
        mint: {
          name: 'Mint',
          icon: 'ion-social-usd',
          color: '#26975b',
          type: 'currency',
          builtIn: true
        }
      },
    //captures all the constructed HighScoreObj's
      highScoreArray;

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
      //if the object had no config, add the pre-set one
      this.config = this.config || setTypes[refObj.id];
    }
    /**
     * save the updated object attributes
     ***/
    HighScoreObj.prototype.saveObj = function (params) {
      var self = this, index, savedScores = localFactory.getData().scores;
      //index of object
      index = savedScores.map(function(score) { return score.id; }).indexOf(this.id);
      Object.keys(params).forEach(function(key) {
        //if a new history is being saved, convert the js Date() to JSON first
        var newVal = key === 'history' ? convertHistory(params.history) : params[key];
        self[key] = newVal;
        savedScores[index][key] = newVal;
      });
      //save new story data
      localFactory.setData('scores', savedScores);
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
        //define defaults
        var newScores, score = {
          id: uniqueId(),
          currentScore: scoreInfo.currentScore || 0,
          highScore: scoreInfo.currentScore || this.currentScore,
          history: []
        };
        //determine whether the score is custom or api driven, return appropriate errors
        if (scoreInfo.apiInfo) {
          if (scoreInfo.config)
            throw 'Score can not have config settings and apiInfo';
          score.apiInfo = scoreInfo.apiInfo
        } else if (scoreInfo.config) {
          score.config = scoreInfo.config
        } else {
          throw 'must have either apiInfo or config';
        }
        //if the application has already generated the highScores array
        if (highScoreArray) highScoreArray.push(new HighScoreObj(score));
        //add and save the new score to savedScores
        newScores = localFactory.getData().scores;
        newScores.push(score);
        localFactory.setData('scores', newScores);
      },
      reorderScores: function (fromIndex, toIndex) {
        var newScores = localFactory.getData().scores;
        newScores.splice(toIndex, 0, newScores.splice(fromIndex, 1)[0]);
        //save new story data
        localFactory.setData('scores', newScores);
        highScoreArray.splice(toIndex, 0, highScoreArray.splice(fromIndex, 1)[0]);
        return highScoreArray;
      },
      /***
       * returns the constructed HighScore Objects if they already exist or query for saved data and then construct the array
       ***/
      getScores: function() {
        if (highScoreArray) return highScoreArray;
        //get saved stories
        return highScoreArray = localFactory.getData().scores.map(function(savedScore) {
          return new HighScoreObj(savedScore);
        });
      }
    };
  });
