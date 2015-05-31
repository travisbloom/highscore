
export default function apiFactory($http, authFactory, userDataFactory, appConfig) {
  let tokenRefreshAttempted;

  return {
    scoreRequest
  };

  function scoreRequest(provider, path, params) {
    return authFactory.getAuth(provider)
      .then((accessObj) => {
        return $http({
          method: 'POST',
          url: appConfig.envs[appConfig.env].apiUri + path,
          data: {auth: accessObj},
          params
        });
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
          return this.scoreRequest(provider, path, params);
        }
        throw err;
      });
  }
}
