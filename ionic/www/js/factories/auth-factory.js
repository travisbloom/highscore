angular.module('starter')
  .factory('authFactory', function($auth, $q) {
    var authIndexes = {};
    return {
      addAuthIndex: function(scoreObj) {
        var provider = scoreObj.apiInfo.provider;
        if (!authIndexes[provider])
        authIndexes[scoreObj.id] = scoreObj.apiInfo
      },
      checkAuth: function (provider) {
        var existingToken = $auth.getToken();
        return $q(function(resolve, reject){
          if (existingToken)
            resolve(existingToken)
        });
        console.log($auth.getToken());
        return $auth.authenticate(provider);
      }
    };
  });
