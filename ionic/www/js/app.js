// load 3rd party angular libraries
angular.module('highScoreApp', [
  //cordova angular wrapper
  'ionic',
  //oAuth2 flow plugin
  'satellizer',
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
            templateUrl: "templates/new-score/new-score-view.html",
            controller: 'newScoreCtrl'
          }
        }
      })
      .state('app.highscores', {
        url: "/highscores",
        views: {
          'menuContent' :{
            templateUrl: "templates/scores.html",
            controller: 'scoresCtrl'
          }
        }
      })
      .state('app.single', {
        url: "/highscores/:highscoreindex",
        views: {
          'menuContent' :{
            templateUrl: "templates/single-score.html",
            controller: 'singleScoreCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/highscores');
  })

  .config(function($authProvider) {
    $authProvider.tokenName = 'access_token';
    //configure facebook credentials
    $authProvider.facebook({
      clientId: config.facebook.clientId,
      url: config.envs[config.env].apiUri + '/facebook/auth',
      redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
  //      redirectUri: window.location.href + '/',
      scope: ['user_photos', 'user_friends']
    });
  });