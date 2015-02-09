angular.module('highScoreApp')
  .factory('authFactory', function($auth, $q, userDataFactory) {
    return {
      /***
       * gets the current list of providers for a given user, checks if the needed provider exists with an access token
       * calls satellizer authenticate if provider access_token doesnt exist
       * save the provider info to userData, save userData to localStorage
       * returns the token either way
       ***/
      getAuth: function (provider) {
        var deferred, providers = userDataFactory.data.providers;
        //if the provider exists, authenticate the user
        //todo shorten this
        if (providers[provider] && providers[provider].jwt) {
          deferred = $q.defer();
          deferred.resolve(providers[provider]);
          return deferred.promise;
        }
        return $auth.authenticate(provider).then(function (response) {
          //save returned auth data to local storage
          var userData = userDataFactory.data;
          userData.providers[provider] = response.data.jwt;
          userDataFactory.data = userData;
          return response.data.jwt;
        });
      }
    };
  });
