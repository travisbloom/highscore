angular.module('starter')
  .factory('mockData', function() {
    var time = new Date();
    time = time.toJSON();
    return function () {
      return {
        userData: {
          providers: {
          }
        },
        scores: [
          {
            id: 'mint',
            highScore: 223,
            currentScore: 2,
            apiInfo: {
              provider: 'mint',
              token: 'test'
            },
            history: [
              {
                date: time,
                score: 2
              }
            ]
          },
          {
            id: '0',
            config: {
              name: 'custom thing',
              icon: 'ion-ios7-redo',
              color: '#26335b',
              type: 'num'
            },
            highScore: 4,
            currentScore: 2,
            incrementValue: 1,
            history: [
              {
                date: time,
                score: 2
              }
            ]
          },
          {
            id: '1',
            config: {
              name: 'custom thing 2',
              icon: 'ion-ios7-pulse',
              color: '#16975b',
              type: 'num'
            },
            highScore: 223,
            currentScore: 2,
            history: [
              {
                date: time,
                score: 2
              }
            ]
          }
        ]
      };
    };
  });
