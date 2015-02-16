angular.module('highScoreApp')
  .factory('thirdPartyFactory', function($q, $http, authFactory, userDataFactory) {
    var providerOptions =  [
      {
        name: 'facebook',
        id: 'facebook',
        config: {
          icon: 'ion-social-facebook',
          color: '#3B5998'
        },
        categories: [
          {
            name: 'Pictures',
            id: 'pictures',
            options: [
              {
                name: 'Likes',
                id: 'likes',
                description: 'Your most liked photo',
                scoreData: {
                  config: {
                    name: 'Facebook Picture Likes',
                    type: 'number'
                  }
                }
              }
            ]
          },
          {
            name: 'Status Updates',
            id: 'status',
            options: [
              {
                name: 'Likes',
                id: 'likes',
                description: 'Your most liked status updates',
                scoreData: {
                  config: {
                    name: 'Facebook Status Likes',
                    type: 'number'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        name: 'Twitter',
        id: 'twitter',
        config: {
          icon: 'ion-social-twitter',
          color: '#00aced'
        },
        categories: [
          {
            name: 'Followers',
            id: 'followers',
            options: [
              {
                name: '',
                id: 'count',
                description: 'Total number of twitter followers',
                scoreData: {
                  config: {
                    name: 'Twitter Followers',
                    type: 'number'
                  }
                }
              }
            ]
          }
        ]
      }
    ];
    (function () {
      providerOptions.forEach(function(provider) {
        provider.categories.forEach(function(category) {
          category.options.forEach(function(option) {
            //add provider configs to option
            angular.extend(option.scoreData.config, provider.config);
            option.scoreData.apiInfo = {
              path: '/' + provider.id + '/' + category.id + '/' + option.id,
              category: category.id,
              option: option.id,
              provider: provider.id
            };
          });
        })
      });
    })();
    var tokenRefreshAttempted;
    //build apiConfig
    return {
      time: ['recent'],
      options: providerOptions,
      scoreRequest: function (provider, path, queryObj) {
        var urlParams = '';
        //if additional URL params are passed to the api server, add them here
        if (queryObj) {
          Object.keys(queryObj).forEach(function(key) {
            //if the property was not falsey
            if (queryObj[key]) urlParams += '&' + key + '=' + queryObj[key]
          })
        }
        return authFactory.getAuth(provider)
          .then(function(accessObj) {
            return $http.get(config.envs[config.env].apiUri + path + '?access_token=' + accessObj.access_token + urlParams);
          })
          .catch(function(err) {
            //if the error was the result of an invalid token being submitted
            if (err.data && err.data.expiredToken  && !tokenRefreshAttempted) {
              //clear the provider token info from the cache
              var data = userDataFactory.data;
              delete data.providers[provider];
              userDataFactory.data = data;
              //set the tokenRefreshAttempt to true to prevent infinite attempts
              tokenRefreshAttempted = true;
              //reattempt the request
              return this.scoreRequest(provider, path, queryObj)
            }
            throw err;
          });
      }
    };
  });
