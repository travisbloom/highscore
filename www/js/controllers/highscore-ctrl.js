angular.module('starter')
  .controller('HighScoreCtrl', function($scope, $stateParams, highScoreFactory) {
    $scope.collapsed = {
      configItem: true
    };
    $scope.item = highScoreFactory.getScores()[$stateParams.highscoreindex];
    $scope.newScore = $scope.item.currentScore;
    $scope.options = {
      axes: {
        x: {
          key: 'date',
          type: 'date',
          labelFunction: function(date) {
            var relTime = moment(date).fromNow();
            return relTime;
          },
          ticks: 2
        }
      },
      series: [{
        y: 'score'
      }],
      tooltip: {mode: 'scrubber', formatter: function(x, y, series) {
        return y;
      }},
      drawLegend: false
    };
    $scope.configureSettings = function () {
      $scope.collapsed.configItem = !$scope.collapsed.configItem;
      if ($scope.collapsed.configItem) {
        $scope.item.saveObj($scope.item.config);
      }
    }
  });
