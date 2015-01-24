angular.module('highScoreApp')
    .directive('newCustomScore', function () {
        return {
            restrict: 'E',
            templateUrl: '../templates/new-score/custom-score.html'
        };
    });