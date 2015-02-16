angular.module('highScoreApp')
  .controller('scoresCtrl', function($scope, highScoreFactory, $location, messageFactory) {
    $scope.show = {
      reorder: false,
      loading: false
    };
    /***
     * load high scores from local storage, catch invalid app data
     ***/
    try {
      $scope.highScores = highScoreFactory.getScores();
    } catch(error) {
      $scope.message = messageFactory.format(error);
      messageFactory.show('error').then(function(){
        $scope.message = null;
      });
    }
    /***
    * open high score page for specific score
    ***/
    $scope.goToScore = function (index) {
      $location.path('/app/highscores/' + index);
    };
    /***
     * reorder scores
     ***/
    $scope.reorderItem = function(item, $fromIndex, $toIndex) {
      $scope.highScores = highScoreFactory.reorderScores($fromIndex, $toIndex);
    };
    /***********************************************
     ***********************************************
     * Functions Specific to 3rd Party Scores
     ***********************************************
     **********************************************/
    //trigger page loading view while score is updated
    $scope.refreshScore = function(e, scoreObj) {
      //prevent click through to next page
      e.stopPropagation();
      scoreObj.loading = true;
      scoreObj.pullScore()
        .then(function(){
          scoreObj.loading = false;
        })
        .catch(function(error){
          scoreObj.loading = false;
          $scope.message = messageFactory.format(error);
          messageFactory.show('error').then(function(){
            $scope.message = null;
          });
        });
    };
    /***********************************************
     ***********************************************
     * Functions Specific to non-incrementing custom scores
     ***********************************************
     **********************************************/
     //used by non-incrementing input box
    $scope.preventClick = function(e) {
      e.stopPropagation();
    };
    $scope.newScore = function(e, scoreObj) {
      e.stopPropagation();
      scoreObj.saveObj({currentScore: scoreObj.newCurrent});
      scoreObj.newCurrent = undefined;
    };
    /***********************************************
     ***********************************************
     * Functions Specific to incrementing custom scores
     ***********************************************
     **********************************************/
    $scope.increment = function(e, scoreObj, direction) {
      e.stopPropagation();
      scoreObj.increment(direction);
    };
  });
