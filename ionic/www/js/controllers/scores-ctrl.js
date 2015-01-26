angular.module('highScoreApp')
  .controller('scoresCtrl', function($scope, highScoreFactory, $location, $ionicLoading) {
    $scope.show = {
      reorder: false,
      loading: false
    };
    //add success message if something is passed in the route
    //todo build alerts design
    if ($location.search().message)
      console.log($location.search().message);
    /***
     * load high scores from local storage, catch invalid app data
     ***/
    try {
      $scope.highScores = highScoreFactory.getScores();
    } catch(e) {
      //todo create error solution
      console.log(e);
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
      $scope.show.loading = true;
      scoreObj.pullScore()
        .then(function(){
          $scope.show.loading = false;
        })
        //todo propegate error to ui
        .catch(function(err){
          $scope.show.loading = false;
          console.log(err)
        });
    };
    /***********************************************
     ***********************************************
     * Functions Specific to non-incrementing custom scores
     ***********************************************
     **********************************************/
     //used by nonincrementing input box
    $scope.preventClick = function(e) {
      e.stopPropagation();
    };
    $scope.newScore = function(e, scoreObj) {
      e.stopPropagation();
      scoreObj.newScore(scoreObj.newCurrent);
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
