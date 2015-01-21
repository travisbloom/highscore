/***
* Factory used to validate locally stored information, return default application schema if it doesn't exist/is invalid
***/
angular.module('starter')
  .factory('localStorageFactory', function($window, mockData) {
    var appData, localStorageKey = 'highScoreData';
    //default appData
    function newAppData() {
      //todo remove mockData override
      return mockData();
      return appData = {
        userData: {
          providers: {}
        },
        scores: []
      }
    }
    return {
      setAppData: function (property, newData) {
        appData[property] = newData;
        $window.localStorage[localStorageKey] = JSON.stringify(appData);
      },
      getAppData: function () {
        var storedAppData;
        //if appData has already been populated
        if (appData)
          return appData;
        //otherwise, query localStorage for saved application data
        storedAppData = $window.localStorage[localStorageKey];
        //if no local object exists, return the new json obj
        if (!storedAppData) return newAppData();
        //if something was returned from localStorage
        try {
            storedAppData = JSON.parse(storedAppData);
          } catch (e) {
            //delete any corrupted data
            $window.localStorage.removeItem(localStorageKey);
            throw {
              userMessage: 'There was an issue with your saved Highscors, the app data has been reset',
              newUserData: newAppData()
            }
          }
          //if the parsed Obj has the correct top level properties
          if (storedAppData.userData && storedAppData.scores)
            return storedAppData;
          throw {
            userMessage: 'There was an issue with your saved Highscors, the app data has been reset',
            newUserData: newAppData()
          }
        }
      }
  });
