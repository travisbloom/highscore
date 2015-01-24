angular.module('starter')
  .factory('authFactory', function($auth, $q, localFactory) {
    var authIndexes = {}, providers = localFactory.appData.userData.providers;
    return {
      addAuthIndex: function(scoreObj) {
        var provider = scoreObj.apiInfo.provider;
        if (!authIndexes[provider])
        authIndexes[scoreObj.id] = scoreObj.apiInfo
      },
      getAuth: function (provider) {
        var deferred = q.defer();
        //if the provider doesn't exist, authenticate the user
        if (!providers[provider]) {
          return $auth.authenticate(provider).then(function (response) {
            providers[provider] = response.data;
            return response.data;
          });
        }
        deferred.resolve(providers[provider]);
        return deferred.promise;
      },
      addAuth: function (provider) {
        return $auth.authenticate(provider).then(function (response) {
          providers[provider] = response.data;
          return response.data;
        });
      }
    };
  });
