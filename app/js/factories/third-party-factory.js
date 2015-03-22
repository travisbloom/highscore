angular.module('highScoreApp')
  .factory('thirdPartyFactory', ($q, $http, authFactory, userDataFactory) => {
    let providerOptions =  [
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
    (() => providerOptions.forEach((provider) =>
      provider.categories.forEach((category) =>
        category.options.forEach((option) => {
            //add provider configs to option
            angular.extend(option.scoreData.config, provider.config);
            option.scoreData.apiInfo = {
              path: '/' + provider.id + '/' + category.id + '/' + option.id,
              category: category.id,
              option: option.id,
              provider: provider.id
            };
        })
      )
    ))();
    let tokenRefreshAttempted;
    //build apiConfig
    return {
      time: ['recent'],
      options: providerOptions,
      scoreRequest(provider, path, queryObj) {
        return authFactory.getAuth(provider)
          .then((accessObj) => {
            let url = CONFIG.envs[CONFIG.env].apiUri + path, paramPrefix = '?';
            //if additional URL params are passed to the api server, add them here
            if (queryObj) {
              //if the property was not falsely
              Object.keys(queryObj).forEach((key) => {
                if (queryObj[key])
                  url += paramPrefix + key + '=' + queryObj[key];
                paramPrefix = '&'
              })
            }
            return $http.post(url, {auth: accessObj});
          })
          .catch((err) => {
            //if the error was the result of an invalid token being submitted
            if (err.data && err.data.expiredToken  && !tokenRefreshAttempted) {
              //clear the provider token info from the cache
              let data = userDataFactory.data;
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
