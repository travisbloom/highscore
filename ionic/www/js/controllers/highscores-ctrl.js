angular.module('highScoreApp')
  .controller('HighScoresCtrl', function($scope, highScoreFactory, $auth, $location) {
    $scope.loading = false;
    $scope.show = {
      reorder: false
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate('facebook').then(function(response) {
        console.log(response)
      });
    };
    $scope.settings = function (index) {
      $location.path('/app/highscores/' + index);
    };
    try {
      $scope.highScores = highScoreFactory.getScores();
      //returns an error if localStorage data is corrupted
    } catch(e) {
      //todo create error solution
      console.log(e);
    }
    $scope.refreshScore = function(e, scoreObj) {
      //prevent click through to next page
      e.stopPropagation();
      $scope.loading = true;
      scoreObj.pullScore()
        .then(function(){
          $scope.loading = false;
        })
        .catch(function(err){
          $scope.loading = false;
          console.log(err)
        });
    };
    $scope.preventClick = function(e) {
      e.stopPropagation();
    };
    $scope.increment = function(e, scoreObj, direction) {
      //prevent click through to next page
      e.stopPropagation();
      scoreObj.increment(direction);
    };
    $scope.newScore = function(e, scoreObj) {
      //prevent click through to next page
      e.stopPropagation();
      scoreObj.newScore(scoreObj.newCurrent);
    };
    $scope.reorderItem = function(item, $fromIndex, $toIndex) {
      $scope.highScores = highScoreFactory.reorderScores($fromIndex, $toIndex);
    }
  });
