export default newScoreController;
function newScoreController(scoresFactory, providerOptions, $ionicLoading, $state, apiFactory, notificationFactory, userDataFactory) {
  //pull in third party options
  this.providerOptions = providerOptions;
  this.show = {
    //governs what tab is being shown
    customScoreTab: false
  };
  //default custom score params
  this.score = {
    currentScore: 0,
    config: {
      type: 'number',
      color: '#000'
    }
  };
  //track previously used custom scores
  this.usedCustomScores = userDataFactory.usedCustomScores;
  /***
   * Functions Specific to 3rd Party Scores
   ***/
  this.addThirdPartyScore = addThirdPartyScore;
  /***
   * Functions Specific to Custom Scores
   ***/
  this.addCustomScore = addCustomScore;

  /***
   * @newScore: submit the newScore object data
   * add a new third party score the users data
   * makes an initial api request, gathering any missing auth data for the given provider
   * set the returned score and metaData, if any, to the newScore obj
   * generate the new score
   ***/
  function addThirdPartyScore(properties) {
    //show loading page, initial loads can take some time
    $ionicLoading.show({
      template: '<div>Processing your ' + properties.apiInfo.provider + ' data. This could take a few seconds the first time we get it.</div>'
    });
    //make an initial request to get starting score/needed metadata
    apiFactory.scoreRequest(properties.apiInfo.provider, properties.apiInfo.path)
      .then((res) => {
        $ionicLoading.hide();
        //append returned data to newScore then create it
        properties.currentScore = res.data.score;
        properties.metaData = res.data.metaData;
        //generate and save the new score
        scoresFactory.newScore(properties);
        //send user to highScores page after successful completion. Pass query param to signal successful signup
        $state.go('^.scoresList');
      })
      .catch((error) => {
        $ionicLoading.hide();
        notificationFactory.show(error);
      });
  }

  /***
   * try to generate the new custom score, retuns an error when invalid data is submitted
   ***/
  function addCustomScore() {
    scoresFactory.newScore(this.score);
    this.score = {
      currentScore: 0,
      config: {
        type: 'number',
        color: '#000'
      }
    };
    $state.go('^.scoresList');
  }
}
