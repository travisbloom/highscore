angular.module('starter')
  .controller('HighScoresCtrl', function($scope, highScoreFactory, $auth, $location) {
    $scope.authenticate = function(provider) {
      $auth.authenticate('facebook').then(function(response) {
        console.log(response)
      });
    };
    //        $scope.authenticate();
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
    console.log($scope.highScores);
//        $scope.highScores = mockData.map(function(item) {
//            return highScoreFactory(item)
//        });
    console.log($scope.highScores);
    $scope.reorderItem = function(item, $fromIndex, $toIndex) {
      $scope.highScores = highScoreFactory.reorderScores($fromIndex, $toIndex);
    }
  });
