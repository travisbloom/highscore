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

    .controller('HighScoresCtrl', function($scope, highScoreFactory) {
        var mockData = [
            {
                id: 'mint',
                highScore: 223,
                currentScore: 2,
                config: {
                    token: 'test'
                }
            },
            {
                id: '0',
                name: 'custom thing',
                config: {
                    custom: true,
                    icon: 'ion-ios7-redo',
                    color: '#26335b',
                    type: 'num'
                },
                highScore: 4,
                currentScore: 2,
                incrementValue: 1
            },
            {
                name: 'custom thing 2',
                id: '1',
                config: {
                    custom: true,
                    icon: 'ion-ios7-pulse',
                    color: '#16975b',
                    type: 'num'
                },
                highScore: 223,
                currentScore: 2
            }
        ];

        $scope.highScores = mockData.map(function(item){
            return highScoreFactory(item)
        });
        $scope.reorderItem = function(item, $fromIndex, $toIndex) {
            $scope.highScores.splice($toIndex, 0, $scope.highScores.splice($fromIndex, 1)[0])
        }
    })

    .controller('HighScoreCtrl', function($scope, $stateParams) {
    });
