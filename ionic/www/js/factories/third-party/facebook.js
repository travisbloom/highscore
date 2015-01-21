angular.module('starter')
  .factory('facebookFactory', function($auth, $q) {
    return {
      checkAuth: function (provider) {
        console.log($auth.getPayload());
        console.log($auth.getToken());
        return $auth.authenticate(provider);
      }
    };
  });
