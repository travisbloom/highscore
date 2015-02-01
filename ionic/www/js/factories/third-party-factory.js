angular.module('highScoreApp')
  .factory('thirdPartyFactory', function($auth, $q, $http, authFactory, userDataFactory) {
    var providerOptions =  [
      {
        name: 'facebook',
        id: 'facebook',
        config: {
          icon: 'ion-social-facebook',
          color: '#26975b'
        },
        timeSpan: true,
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
          .then(function(token) {
            return $http.get(config.envs[config.env].apiUri + path + '?access_token=' + token + urlParams);
          }).then(function(res) {
            return res;
          });
      }
    };
  });
