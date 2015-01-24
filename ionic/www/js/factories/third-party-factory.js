angular.module('starter')
  .factory('thirdPartyFactory', function($auth, $q) {
    var paths =  {
      time: ['recent'],
      providers: [
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
      ]
    };
    //build apiConfig
    return (function () {
      paths.providers.forEach(function(provider) {
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
      return paths;
    })();
  });
