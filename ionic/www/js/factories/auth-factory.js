angular.module('highScoreApp')
  .factory('authFactory', function($auth, $q, localFactory) {
    var  providers = localFactory.appData.userData.providers;
    return {
      getAuth: function (provider) {
        var deferred = $q.defer();
        //if the provider doesn't exist, authenticate the user
        if (!providers[provider] || !providers[provider].access_token) {
          return $auth.authenticate(provider).then(function (response) {
            providers[provider] = response.data.access_token;
            return response.data.access_token;
          });
        }
        deferred.resolve(providers[provider].access_token);
        return deferred.promise;
      }
    };
  });
