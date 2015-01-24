angular.module('highScoreApp')
  .controller('HighScoresCtrl', function($scope, highScoreFactory, $auth, $location) {
    $scope.authenticate = function(provider) {
      $auth.authenticate('facebook').then(function(response) {
        console.log(response)
      });
    };
    $scope.settings = function (index) {
      $location.path('/app/highscores/' + index);
    };
    $scope.highScores = highScoreFactory.getScores();
    try {
      //returns an error if localStorage data is corrupted
    } catch(e) {
      //todo create error solution
      console.log(e);
    }
    $scope.refreshScore = function(scoreObj) {
      scoreObj.pullScore().catch(function(err){
        console.log(err)
      });
    };
    //        $scope.highScores = mockData.map(function(item) {
//            return highScoreFactory(item)
//        });
    console.log($scope.highScores);
    $scope.reorderItem = function(item, $fromIndex, $toIndex) {
      $scope.highScores = highScoreFactory.reorderScores($fromIndex, $toIndex);
    }
  });
