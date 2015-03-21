angular.module('highScoreApp')
  .factory('authFactory', function($cordovaOauth, $q, userDataFactory) {
    var providerDetails = {
      facebook: [config.facebook.clientId, ['user_photos', 'user_friends', 'read_stream ']],
      twitter: [config.twitter.clientId, config.twitter.clientSecret]
    };
    return {
      /***
       * gets the current list of providers for a given user, checks if the needed provider exists with an access token
       * calls satellizer authenticate if provider access_token doesn't exist
       * save the provider info to userData, save userData to localStorage
       * returns the token either way
       ***/
      getAuth: function (provider) {
        var deferred = $q.defer(), providers = userDataFactory.data.providers;
        //if the provider exists, authenticate the user
        //todo shorten this
        if (providers[provider]) {
          deferred.resolve(providers[provider]);
          return deferred.promise;
        }
        return $cordovaOauth[provider].apply(this, providerDetails[provider])
          .then(function (response) {
            console.log(response);
            //save returned auth data to local storage
            var userData = userDataFactory.data;
            userData.providers[provider] = response;
            userDataFactory.data = userData;
            return response;
          });
      }
    };
  });
