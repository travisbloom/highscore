
export default function apiFactory($http, authFactory, userDataFactory, appConfig) {
  let tokenRefreshAttempted;

  return {
    scoreRequest
  };

  function scoreRequest(provider, path, queryObj) {
    return authFactory.getAuth(provider)
      .then((accessObj) => {
        let url = appConfig.envs[appConfig.env].apiUri + path;
        //if additional URL params are passed to the api server, add them here
        if (queryObj) {
          url += Object.keys(queryObj).reduce((paramString, key) => paramString + key + '=' + queryObj[key], '?');
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
}
