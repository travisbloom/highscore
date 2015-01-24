angular.module('starter')
  .factory('dataModelFactory', function() {
    return {
      preSetConfigs: {
        mint: {
          name: 'Mint',
          icon: 'ion-social-usd',
          color: '#26975b',
          type: 'currency'
        },
        facebook: {
          icon: 'ion-social-usd',
          color: '#26975b',
          type: 'currency'
        }
      },
      scoreTypes: {
        id: 'string',
        config: {
          name: 'string',
          icon: [
            'ion-social-usd',
            'ion-home',
            'ion-heart',
            'ion-star',
            'ion-flag',
            'ion-hammer',
            'ion-edit',
            'ion-bookmark',
            'ion-paper-airplane',
            'ion-cloud',
            'ion-compass',
            'ion-clock',
            'ion-map',
            'ion-arrow-graph-up-right',
            'ion-connection-bars',
            'ion-person-stalker',
            'ion-fork',
            'ion-beer',
            'ion-wineglass',
            'ion-battery-charging',
            'ion-camera',
            'ion-paintbrush',
            'ion-ipod',
            'ion-code',
            'ion-videocamera',
            'ion-headphone',
            'ion-thumbsup',
            'ion-thumbsdown',
            'ion-pricetags',
            'ion-cash',
            'ion-trophy',
            'ion-bowtie',
            'ion-happy-outline',
            'ion-university',
            'ion-earth',
            'ion-bonfire',
            'ion-plane'
          ],
          color: '#26335b',
          type: ['number', 'currency']
        },
        highScore: 4,
        currentScore: 2,
        incrementValue: 1,
        history: [
          {
            date: 'time',
            score: 2
          }
        ]
      }
    }
  });
