angular.module('highScoreApp')
  .controller('singleScoreCtrl', function($scope, $stateParams, highScoreFactory, $ionicModal, $ionicScrollDelegate, $location) {
    //default config for collapsible elements
    $scope.show = {
      config: false
    };
    //pull the score from the url params
    $scope.score = highScoreFactory.getScores()[$stateParams.highscoreindex];
    //set initial newScore params to the current score, ensures changes will be tracked
    $scope.newScore = $scope.score.currentScore;
    //graph config options
    $scope.options = {
      axes: {
        x: {
          key: 'date',
          //treat x axis as date
          type: 'date',
          //apply relative timing function to labels
          labelFunction: function(date) {
            return moment(date).fromNow();
          },
          //number of x axis ticks
          ticks: 3
        }
      },
      series: [{
        y: 'score',
        thickness: '3px',
        type: "area"
      }],
      tooltip: {mode: 'scrubber', formatter: function(x, y, series) {
        return y;
      }},
      drawLegend: false,
      drawDots: false
    };
    /***
     * increment the score, refresh newScore to reflect update
     ***/
    $scope.increment = function (direction) {
      $scope.score.increment(direction);
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
