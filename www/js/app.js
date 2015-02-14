// load 3rd party angular libraries
angular.module('highScoreApp', [
  //cordova angular wrapper
  'ionic',
  //oAuth2 flow plugin
  'ngCordovaOauth',
  //d3 charts
  'n3-line-chart'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'mainCtrl'
      })
      .state('app.new', {
        url: "/new",
        views: {
          'menuContent' :{
            templateUrl: "templates/new-score-view.html",
            controller: 'newScoreCtrl'
          }
        }
      })
      .state('app.highscores', {
        url: "/highscores?message",
        views: {
          'menuContent' :{
            templateUrl: "templates/scores-view.html",
            controller: 'scoresCtrl'
          }
        }
      })
      .state('app.single', {
        url: "/highscores/:highscoreindex",
        views: {
          'menuContent' :{
            templateUrl: "templates/single-score-view.html",
            controller: 'singleScoreCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/highscores');
  })

  .config(function( $httpProvider) {
    //set timeout to 1000 on all http requests coming from the application
    $httpProvider.interceptors.push(function() {
      return {
        'request': function (config) {
          //http request have 10 seconds before timeout
          //todo wrap all errors in a factory to determine response
          config.timeout = 100000;
          return config;
        }
      }
    });
  });