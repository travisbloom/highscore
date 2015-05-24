/***
 * Factory used to validate locally stored information, return default application schema if it doesn't exist/is invalid
 ***/
angular.module('highScoreApp')
  .factory('userDataFactory', ($window) => {
    const LOCAL_STORAGE_KEY = 'highScoreData';
    /***
     * returns userData if the reference is truthy
     * otherwise, pull userData from localStorage
     * return default userData if none exists in local storage
     * parse the localStorage and validate top level attributes of local storage
     * return the parsed obj or an error if validation/parsing fails
     ***/
    let userData = (() => {
      let localValue = $window.localStorage[LOCAL_STORAGE_KEY];
      if (!localValue) return defaultUserData();
      try {
        localValue = JSON.parse(localValue);
      } catch (e) {
        $window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        return defaultUserData();
      }
      if (!localValue.usedCustomScores || !localValue.providers || !localValue.scores) {
        $window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        return defaultUserData();
      }
      return localValue;
    })();

    return {
      get scores() {
        return userData.scores;
      },
      set scores(scores) {
        userData.scores = scores;
        $window.localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(userData);
      },
      get usedCustomScores() {
        return userData.usedCustomScores;
      },
      set usedCustomScores(usedCustomScores) {
        userData.usedCustomScores = usedCustomScores;
        $window.localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(userData);
      },
      get providers() {
        return userData.providers;
      },
      set providers(providers) {
        userData.providers = providers;
        $window.localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(userData);
      }
    };

    /***
     * returns default userData
     ***/
    function defaultUserData() {
      userData = {
          //array of strings that describe the paths of customScores already existing in scores
          //used to grey out options when selecting new custom scores
          usedCustomScores: [],
          //object that contains an obj property for each known provider, provider obj contains relevant metadata (access_token, etc)
          providers: {},
          //the scores that exist for a given user, an array of score objects
          scores: []
      };
      return userData;
    }
  });