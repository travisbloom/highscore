const appConfig = {
  facebook: {
    clientId: 'CHANGE_ME'
  },
  twitter: {
    clientId: 'CHANGE_ME',
    clientSecret: 'CHANGE_ME'
  },
  env: 'dev',
  envs: {
    local: {
      apiUri: 'http://localhost:3000'
    },
    dev: {
      apiUri: 'http://dev.api.highscor.com'
    }
  }
};

export default appConfig;
