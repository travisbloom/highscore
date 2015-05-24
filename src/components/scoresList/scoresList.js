angular.module('highScoreApp')
  .controller('scoresListController', function(scoresFactory, $location, messageFactory) {
    this.show = {
      reorder: false,
      loading: false
    };
    //load high scores from local storage
    this.highScores = scoresFactory.getScores();

    this.reorderItem = scoresFactory.reorderScores;
    /***
     * 3rd party score functions
     ***/
    //trigger page loading view while score is updated
    this.refreshScore = refreshScore;
    /***
     * non-incrementing custom score functions
     ***/
    this.preventClick = (event) => event.stopPropagation;
    //used by input box
    this.newScore = newScore;
    /***
     * incrementing custom score functions
     ***/
    this.increment = increment;

    function increment(event, highScore, direction) {
      event.stopPropagation();
      highScore.increment(direction);
    }

    function newScore(event, highScore) {
      event.stopPropagation();
      highScore.saveObj({currentScore: highScore.potentialScore});
      highScore.potentialScore = null;
    }

    function refreshScore(event, highScore) {
      event.stopPropagation();
      highScore.loading = true;
      highScore.pullScore()
        .then(() => highScore.loading = false )
        .catch((error) => {
          highScore.loading = false;
          this.message = messageFactory.format(error);
          messageFactory.show('error').then(()=> this.message = null );
        });
    }
  });

