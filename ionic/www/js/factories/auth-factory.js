angular.module('highScoreApp')
  .factory('authFactory', function($auth, $q, localFactory) {
    var  providers = localFactory.appData.userData.providers;
    return {
      getAuth: function (provider) {
        var deferred = $q.defer();
        console.log(provider)
        console.log(provider)
        //if the provider doesn't exist, authenticate the user
        if (!providers[provider] || !providers[provider].access_token) {
          return $auth.authenticate(provider).then(function (response) {
            var appData = localFactory.appData;
            appData.userData.providers[provider] = response.data.access_token;
            localFactory.appData = appData;
            return response.data.access_token;
          });
        }
        deferred.resolve(providers[provider].access_token);
        return deferred.promise;
      }
    };
  });
