angular.module('highScoreApp')
  .factory('apiFactory', ($q, $http, authFactory, userDataFactory, providerOptions, appConfig) => {
    let tokenRefreshAttempted;

    providerOptions.forEach((provider) => {
      provider.categories.forEach((category) => {
        category.options.forEach((option) => {
          //add provider configs to option
          angular.extend(option.scoreData.config, provider.config);
          option.scoreData.apiInfo = {
            path: '/' + provider.id + '/' + category.id + '/' + option.id,
            category: category.id,
            option: option.id,
            provider: provider.id
          };
        });
      });
    });

    return {
      scoreRequest
    };

    function scoreRequest(provider, path, queryObj) {
      return authFactory.getAuth(provider)
        .then((accessObj) => {
          let url = appConfig.envs[appConfig.env].apiUri + path, paramPrefix = '?';
          //if additional URL params are passed to the api server, add them here
          if (queryObj) {
            //if the property was not falsely
            Object.keys(queryObj).forEach((key) => {
              if (!queryObj[key]) return;
              url += paramPrefix + key + '=' + queryObj[key];
              paramPrefix = '&';
            });
          }
          return $http.post(url, {auth: accessObj});
        })
        .catch((err) => {
          //if the error was the result of an invalid token being submitted
          if (err.data && err.data.expiredToken && !tokenRefreshAttempted) {
            //clear the provider token info from the cache
            let providers = userDataFactory.providers;
            providers[provider] = null;
            userDataFactory.providers = providers;
            //set the tokenRefreshAttempt to true to prevent infinite attempts
            tokenRefreshAttempted = true;
            //reattempt the request
            return this.scoreRequest(provider, path, queryObj);
          }
          throw err;
        });
    }
  });
