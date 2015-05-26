const providerOptions = [
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

providerOptions.forEach((provider) => {
  provider.categories.forEach((category) => {
    category.options.forEach((option) => {
      //add provider configs to option
      angular.extend(option.scoreData.config, provider.config);
      option.scoreData.apiInfo = {
        path: '/' + provider.id + '/' + category.id + '/' + option.id,
        category: category.id,
        option: option.id,
        provider: provider.id
      };
    });
  });
});

export default providerOptions;
