angular.module('highScoreApp')
  .factory('scoresFactory', (userDataFactory, scoreConstructorFactory) => {
    let highScores;
    /***
     * Factory Returned Functions
     ***/
    return {
      newScore,
      deleteScore,
      reorderScores,
      getScores
    };

    /***
     * returns the constructed HighScore Objects if they already exist or query for saved data and then construct the array
     ***/
    function deleteScore(index) {
      highScores.splice(index, 1);
      userDataFactory.scores = highScores;
    }

    function getScores() {
      if (highScores) return highScores;
      //get saved stories
      highScores = userDataFactory.data.scores ?
        userDataFactory.data.scores.map((savedScore) =>  scoreConstructorFactory.newScore(savedScore)) : [];
      userDataFactory.scores = highScores;
      return highScores;
    }

    function reorderScores(fromIndex, toIndex) {
      highScores.splice(toIndex, 0, highScores.splice(fromIndex, 1)[0]);
      userDataFactory.scores = highScores;
      return highScores;
    }

    function newScore(properties) {
      highScores.push(scoreConstructorFactory.newScore(properties));
      userDataFactory.scores = highScores;
    }
  });
