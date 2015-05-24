angular.module('highScoreApp')
  .value('providerOptions', [
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
  ]);
