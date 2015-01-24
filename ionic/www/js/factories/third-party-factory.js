angular.module('starter')
  .factory('thirdPartyFactory', function($auth, $q) {
    var paths =  {
      time: ['recent'],
      providers: [
        {
          name: 'facebook',
          id: 'facebook',
          timeSpan: true,
          categories: [
            {
              name: 'Pictures',
              id: 'pictures',
              options: [
                {
                  name: 'Likes',
                  id: 'likes',
                  description: 'The number of recent likes you\'ve gotten on photos'
                }
              ]
            }
          ]
        }
      ]
    };
    //build routes
    return (function () {
      paths.providers.forEach(function(provider) {
        provider.categories.forEach(function(category) {
          category.options.forEach(function(option){
            option.path = '/' + provider.path + '/' + category.path + '/' + option.path;
            //removes the '/' before the providers name
            option.provider = provider.id;
          });
        })
      });
      return paths;
    })();
  });
