
export function cordovaRun($ionicPlatform) {
  $ionicPlatform.ready(() => {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}

export function stateConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('main', {
      url: "",
      abstract: true,
      templateUrl: "components/main/main.html",
      controller: 'mainController as main'
    })
    .state('main.newScore', {
      url: "/new",
      views: {
        'menuContent': {
          templateUrl: "components/newScore/newScore.html",
          controller: 'newScoreController as newScore'
        }
      }
    })
    .state('main.scoresList', {
      url: "/scores",
      views: {
        'menuContent': {
          templateUrl: "components/scoresList/scoresList.html",
          controller: 'scoresListController as scoresList'
        }
      }
    })
    .state('main.score', {
      url: "/scores/:index",
      views: {
        'menuContent': {
          templateUrl: "components/score/score.html",
          controller: 'scoreController as score'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/scores');
}

export function httpIntercept($httpProvider) {
  //set timeout to 1000 on all http requests coming from the application
  $httpProvider.interceptors.push(() => {
    return {
      request(config) {
        //http request have 10 seconds before timeout
        config.timeout = 100000;
        return config;
      }
    };
  });
}