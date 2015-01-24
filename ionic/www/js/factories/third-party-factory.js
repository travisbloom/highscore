angular.module('starter')
  .factory('thirdPartyFactory', function($auth, $q, $http, authFactory) {
    var providerOptions =  [
      {
        name: 'facebook',
        id: 'facebook',
        config: {
          icon: 'ion-social-usd',
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
                description: 'Most likes on a photo',
                scoreData: {
                  config: {
                    name: 'Facebook Picture Likes',
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
      tokenReq: function (provider, path) {
        return authFactory.getAuth(provider)
          .then(function(token) {
            return $http.get(config.envs[config.env].apiUri + path + '?access_token=' + token);
          }).then(function(res) {
            return res;
          });
      }
    };
  });
