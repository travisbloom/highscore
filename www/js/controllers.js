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

    .controller('HighScoresCtrl', function($scope, highScoreFactory, $auth) {
        highScoreFactory.savedItems = highScoreFactory.getItems()  || [
            {
                id: 'mint',
                highScore: 223,
                currentScore: 2,
                token: 'test'
            },
            {
                id: '0',
                config: {
                    name: 'custom thing',
                    icon: 'ion-ios7-redo',
                    color: '#26335b',
                    type: 'num'
                },
                highScore: 4,
                currentScore: 2,
                incrementValue: 1
            },
            {
                id: '1',
                config: {
                    name: 'custom thing 2',
                    icon: 'ion-ios7-pulse',
                    color: '#16975b',
                    type: 'num'
                },
                highScore: 223,
                currentScore: 2
            }
        ];
        console.log(highScoreFactory.savedItems);
        $scope.highScores = [];
        $scope.authenticate = function(provider) {
            $auth.authenticate('facebook').then(function(response) {
                console.log(response)
            });
        };
//        $scope.authenticate();
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

    .controller('HighScoreCtrl', function($scope, $stateParams) {
    });
