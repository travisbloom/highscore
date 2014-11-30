angular.module('starter')
    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('HighScoresCtrl', function($scope, highScoreFactory, $auth, $location) {
        $scope.highScores = [];
        $scope.authenticate = function(provider) {
            $auth.authenticate('facebook').then(function(response) {
                console.log(response)
            });
        };
        //        $scope.authenticate();
        $scope.settings = function (index) {
            $location.path('/app/highscores/' + index);
        };
        for (var i = 0; i < highScoreFactory.savedItems.length; i++) {
            highScoreFactory.savedItems[i].index = i;
            $scope.highScores.push(highScoreFactory.newItem(highScoreFactory.savedItems[i]));
        }
        console.log($scope.highScores);
//        $scope.highScores = mockData.map(function(item) {
//            return highScoreFactory(item)
//        });
        console.log($scope.highScores);
        $scope.reorderItem = function(item, $fromIndex, $toIndex) {
            $scope.highScores.splice($toIndex, 0, $scope.highScores.splice($fromIndex, 1)[0]);
        }
    })

    .controller('HighScoreCtrl', function($scope, $stateParams, highScoreFactory) {
        var dates = [];
        $scope.item = highScoreFactory.newItem(highScoreFactory.savedItems[$stateParams.highscoreindex]);
        console.log($scope.item);
        $scope.options = {
            axes: {
                x: {
                    key: 'date',
                    type: 'date',
                    labelFunction: function(date) {
                        var relTime = moment(date).fromNow();
                        return relTime;
                    }
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
    });
