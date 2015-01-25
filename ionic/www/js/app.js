// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('highScoreApp', ['ionic', 'satellizer', 'n3-line-chart'])

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
        controller: 'AppCtrl'
      })
      .state('app.search', {
        url: "/search",
        views: {
          'menuContent' :{
            templateUrl: "templates/search.html"
          }
        }
      })
      .state('app.new', {
        url: "/new",
        views: {
          'menuContent' :{
            templateUrl: "templates/new-score/new-score-view.html",
            controller: 'NewScoreCtrl'
          }
        }
      })
      .state('app.highscores', {
        url: "/highscores",
        views: {
          'menuContent' :{
            templateUrl: "templates/highscores.html",
            controller: 'HighScoresCtrl'
          }
        }
      })

      .state('app.single', {
        url: "/highscores/:highscoreindex",
        views: {
          'menuContent' :{
            templateUrl: "templates/highscore.html",
            controller: 'HighScoreCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/highscores');
  })

  .config(function($authProvider) {
    $authProvider.tokenName = 'access_token';
    $authProvider.facebook({
      clientId: config.facebook.clientId,
      url: config.envs[config.env].apiUri + '/facebook/auth',
      redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
//      redirectUri: window.location.href + '/',
      scope: ['user_photos', 'user_friends']
    });
  });