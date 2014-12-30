angular.module('starter')
  .controller('HighScoreCtrl', function($scope, $stateParams, highScoreFactory, dataModelFactory, $ionicModal) {
    //default config for collapsable elemnts
    $scope.config = {
      collapsed: true,
      options: {
        type: dataModelFactory.config.type
      }
    };
    //pull the item from the url params
    $scope.item = highScoreFactory.getScores()[$stateParams.highscoreindex];
    //set newScore to track if it differs from currentScore
    $scope.newScore = $scope.item.currentScore;
    //graph config options
    $scope.options = {
      axes: {
        x: {
          key: 'date',
          //treat x axis as date
          type: 'date',
          //apply relative timing function to labels
          labelFunction: function(date) {
            var relTime = moment(date).fromNow();
            return relTime;
          },
          //number of x axis ticks
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
    //icon modal configuration/injection
    $ionicModal.fromTemplateUrl('templates/modal-icons.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.icons = dataModelFactory.config.icon;
    //increment the item then refresh newScore
    $scope.increment = function (direction) {
      $scope.item.increment(direction);
      $scope.newScore = $scope.item.currentScore;
    };
    $scope.configureSettings = function () {
      $scope.config.collapsed = !$scope.config.collapsed;
      if ($scope.config.collapsed) {
        $scope.item.saveObj($scope.item.config);
      }
    };
    $scope.selectIcon = function (icon) {

    }
  });
