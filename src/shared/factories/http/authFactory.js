export default function authFactory($cordovaOauth, $q, userDataFactory, appConfig) {
  const PROVIDER_DETAILS = {
    facebook: [appConfig.facebook.clientId, ['user_photos', 'user_friends', 'read_stream ']],
    twitter: [appConfig.twitter.clientId, appConfig.twitter.clientSecret]
  };
  return {
    getAuth
  };
  /***
   * gets the current list of providers for a given user, checks if the needed provider exists with an access token
   * calls satellizer authenticate if provider access_token doesn't exist
   * save the provider info to userData, save userData to localStorage
   * returns the token either way
   ***/
  function getAuth(provider) {
    let providers = userDataFactory.providers;
    //if the provider exists, authenticate the user
    if (providers[provider]) return $q.when(providers[provider]);
    return $cordovaOauth[provider](...PROVIDER_DETAILS[provider])
      .then((response) => {
        userDataFactory.providers[provider] = response;
        return response;
      });
  }
}
