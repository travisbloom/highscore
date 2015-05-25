angular.module('highScoreApp')
  .factory('scoresFactory', (userDataFactory, scoreConstructorFactory) => {
    //convert the json scores to highScore objects
    userDataFactory.scores = userDataFactory.scores.map((savedScore) => {
      savedScore.history = savedScore.history.map((historyPoint) => {
        historyPoint.date = new Date(historyPoint.date);
        return historyPoint;
      });
      return new scoreConstructorFactory(savedScore);
    });
    let scores = userDataFactory.scores;

    /***
     * Factory Returned Functions
     ***/
    return {
      getScores,
      newScore,
      deleteScore,
      reorderScores
    };

    /***
     * returns the constructed HighScore Objects if they already exist or query for saved data and then construct the array
     ***/
    function deleteScore(index) {
      scores.splice(index, 1);
      userDataFactory.scores = scores;
    }

    function reorderScores(fromIndex, toIndex) {
      scores.splice(toIndex, 0, scores.splice(fromIndex, 1)[0]);
      userDataFactory.scores = scores;
    }

    function getScores() {
      return scores;
    }

    function newScore(properties) {
      scores.push(new scoreConstructorFactory(properties));
      userDataFactory.scores = scores;
    }
  });
