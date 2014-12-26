angular.module('starter')
  .factory('highScoreFactory', function($window, mockData) {
    var localStorageKey = 'highScoreData',
      setTypes = {
        mint: {
          name: 'Mint',
          icon: 'ion-social-usd',
          color: '#26975b',
          type: 'currency',
          builtIn: true
        }
      },
    //saves reference to JSON data returned about objects
      savedData,
    //captures all the constructed HighScoreObj's
      highScoreArray;
    //save users set of items to local storage
    function saveItems() {
      $window.localStorage[localStorageKey] = JSON.stringify(savedData);
    }
    //converts the json date info to javascript date obj on history property
    function convertHistory(history) {
      return history.map(function (datapoint) {
        return {
          score: datapoint.score,
          date: new Date(+datapoint.date)
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
        if (key === 'history')
          return self.history = convertHistory(refObj.history);
        //add the json properties to the new obj
        self[key] = refObj[key];
      });
      //if the object had no config, add the pre-set one
      this.config = this.config || setTypes[refObj.id];
    }
    /**
     * save the updated object attributes
     ***/
    HighScoreObj.prototype.saveObj = function (params) {
      var self = this,
        index = savedData.map(function(score) {
          return score.id;
          }).indexOf(this.id);
      Object.keys(params).forEach(function(key) {
        self[key] = params[key];
        savedData[index][key] = params[key];
      });
      saveItems();
    };
    /***
     * updates the current score, adds the new score to the history array, and updates high score if applicable
     ***/
    HighScoreObj.prototype.newScore = function (score) {
      var currentTime = new Date(), params;
      currentTime = currentTime.getTime().toString();
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
      //if there is no default incrementValue and a number is not passed
      if (!this.incrementValue)
        throw 'uncaught increment amount';
      if (amount === 'down')
        return this.newScore(-this.incrementValue + this.currentScore);
      //default to adding the increment value
      return this.newScore(this.incrementValue + this.currentScore);
    };
    //returned functions
    return {
      newScore: function (scoreInfo) {

      },
      reorderScores: function (fromIndex, toIndex) {
        savedData.splice(toIndex, 0, savedData.splice(fromIndex, 1)[0]);
        saveItems();
        highScoreArray.splice(toIndex, 0, highScoreArray.splice(fromIndex, 1)[0]);
        return highScoreArray;
      },
      /***
       * returns the constructed HighScore Objects if they already exist or query for saved data and then construct the array
       ***/
      getScores: function() {
        //if the highScore array has already been populated
        if (highScoreArray)
          return highScoreArray;
        //otherwise, query localStorage for saved application data
        savedData = $window.localStorage[localStorageKey];
        //if it exists, parse the JSON string
        if (savedData) {
          try {
            savedData = JSON.parse(savedData);
          } catch (e) {
            //delete any corrupted data
            $window.localStorage.removeItem(localStorageKey);
            throw 'There was an issue with your saved Highscors and the application had to reset your data.';
          }
          return highScoreArray = savedData.map(function(savedScore) {
            return new HighScoreObj(savedScore);
          });
        }
      }
    };
  });
