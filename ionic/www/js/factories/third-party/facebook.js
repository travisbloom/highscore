angular.module('starter')
  .factory('facebookFactory', function($auth, $q) {
    return {
      checkAuth: function (provider) {
        return $auth.authenticate(provider);
      }
    };
  });
