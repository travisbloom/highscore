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
        url: "/highscores?message",
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

  .config(function($authProvider, $httpProvider) {
    $authProvider.tokenName = 'access_token';
    //prevent default redirects to occur, allow individual controllers to determine flow
    $authProvider.loginRedirect = null;
    //configure facebook credentials
    $authProvider.facebook({
      clientId: config.facebook.clientId,
      url: config.envs[config.env].apiUri + '/facebook/auth',
      redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
      scope: ['user_photos', 'user_friends', 'read_stream ']
    });
    $authProvider.twitter({
      url: config.envs[config.env].apiUri + '/oauth1/request?provider=twitter'
    });
    //set timeout to 1000 on all http requests coming from the application
    $httpProvider.interceptors.push(function() {
      return {
        'request': function (config) {
          //http request have 10 seconds before timeout
          //todo wrap all errors in a factory to determine response
          config.timeout = 10000;
          return config;
        }
      }
    });
  });