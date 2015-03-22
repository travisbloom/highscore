angular.module('highScoreApp')
  .controller('scoresCtrl', function(highScoreFactory, $location, messageFactory) {
    this.show = {
      reorder: false,
      loading: false
    };
    /***
     * load high scores from local storage, catch invalid app data
     ***/
    try {
      this.highScores = highScoreFactory.getScores();
    } catch(error) {
      this.message = messageFactory.format(error);
      messageFactory.show('error').then(()=> this.message = null );
    }
    console.log(this.highScores)
    /***
    * open high score page for specific score
    ***/
    this.goToScore = function (index) {
      $location.path('/app/highscores/' + index);
    };
    /***
     * reorder scores
     ***/
    this.reorderItem = function(item, $fromIndex, $toIndex) {
      this.highScores = highScoreFactory.reorderScores($fromIndex, $toIndex);
    };
    /***********************************************
     ***********************************************
     * Functions Specific to 3rd Party Scores
     ***********************************************
     **********************************************/
    //trigger page loading view while score is updated
    this.refreshScore = function(e, scoreObj) {
      //prevent click through to next page
      e.stopPropagation();
      scoreObj.loading = true;
      scoreObj.pullScore()
        .then(() => scoreObj.loading = false )
        .catch((error) => {
          scoreObj.loading = false;
          this.message = messageFactory.format(error);
          messageFactory.show('error').then(()=> this.message = null );
        });
    };
    /***********************************************
     ***********************************************
     * Functions Specific to non-incrementing custom scores
     ***********************************************
     **********************************************/
     //used by non-incrementing input box
    this.preventClick = function(e) {
      e.stopPropagation();
    };
    this.newScore = function(e, scoreObj) {
      e.stopPropagation();
      scoreObj.saveObj({currentScore: scoreObj.newCurrent});
      scoreObj.newCurrent = undefined;
    };
    /***********************************************
     ***********************************************
     * Functions Specific to incrementing custom scores
     ***********************************************
     **********************************************/
    this.increment = function(e, scoreObj, direction) {
      e.stopPropagation();
      scoreObj.increment(direction);
    };
  });

