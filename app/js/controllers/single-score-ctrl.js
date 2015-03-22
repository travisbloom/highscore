angular.module('highScoreApp')
  .controller('singleScoreCtrl', ($scope, $stateParams, highScoreFactory, $ionicModal, $ionicScrollDelegate, $location, messageFactory) => {
    //default config for collapsible elements
    $scope.show = {
      config: false
    };
    //pull the score from the url params
    $scope.score = highScoreFactory.getScores()[$stateParams.highscoreindex];
    //set initial newScore params to the current score, ensures changes will be tracked
    $scope.changes = { newScore: $scope.score.currentScore };
    //graph config options
    $scope.options = {
      axes: {
        x: {
          key: 'date',
          //treat x axis as date
          type: 'date',
          //apply relative timing function to labels
          labelFunction(date) { return moment(date).fromNow() },
          //number of x axis ticks
          ticks: 3
        }
      },
      series: [{
        y: 'score',
        thickness: '3px',
        type: "area"
      }],
      tooltip: {
        mode: 'scrubber',
        formatter(x, y, series) { return y }
      },
      drawLegend: false,
      drawDots: false
    };
    /***
     * increment the score, refresh newScore to reflect update
     ***/
    $scope.increment = function (direction) {
      $scope.score.increment(direction);
      $scope.changes.newScore = $scope.score.currentScore;
    };

    $scope.saveNewScore = function() {
      console.log($scope.score.currentScore);
      console.log($scope.changes.newScore);
      $scope.score.saveObj({
        currentScore: $scope.changes.newScore
      });
      $scope.newScore = $scope.score.currentScore;
    };
    /***
     * open the config options if they are closed, close and save the update config options if they changed
     ***/
    $scope.configureSettings = function () {
      $scope.show.config = !$scope.show.config;
      //if saving an open config
      if (!$scope.show.config) {
        $ionicScrollDelegate.scrollTop(true);
        $scope.score.saveObj({config: $scope.score.config});
      } else {
        $ionicScrollDelegate.scrollBottom(true);
      }
    };
    $scope.deleteScore = function() {
      $scope.score.removeScore();
      $location.path('/app/highscores');
    }
  });
