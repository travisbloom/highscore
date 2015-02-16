angular.module('highScoreApp')
  .controller('newScoreCtrl', function($scope, highScoreFactory, $ionicModal, thirdPartyFactory, $ionicLoading, $location, messageFactory, userDataFactory) {
    $scope.message = {};
    //pull in third party options
    $scope.thirdPartyOptions = thirdPartyFactory.options;
    $scope.show = {
      //governs what tab is being shown
      customScoreTab: false
    };
    //track previously used custom scores
    $scope.usedCustomScores = userDataFactory.data.usedCustomScores;
    /***********************************************
     ***********************************************
     * Data Specific to 3rd Party Scores
     ***********************************************
     **********************************************/
    /***
     * @newScore: submit the newScore object data
     * add a new third party score the users data
     * makes an initial api request, gathering any missing auth data for the given provider
     * set the returned score and metaData, if any, to the newScore obj
     * generate the new score
     ***/
    $scope.addThirdPartyScore = function(newScore) {
      //show loading page, initial loads can take some time
      $ionicLoading.show({
        template: '<div>Processing your ' + newScore.apiInfo.provider + ' data. This could take a few seconds the first time we get it.</div>'
      });
      //make an initial request to get starting score/needed metadata
      thirdPartyFactory.scoreRequest(newScore.apiInfo.provider, newScore.apiInfo.path).then(function(res) {
        $ionicLoading.hide();
        console.log(res);
        //append returned data to newScore then create it
        newScore.currentScore = res.data.score;
        newScore.metaData = res.data.metaData;
        //generate and save the new score
        highScoreFactory.newScore(newScore);
        //send user to highScores page after successful completion. Pass query param to signal successful signup
        $location.path('/app/highscores');
      }).catch(function(error) {
        $ionicLoading.hide();
        $scope.message = messageFactory.format(error);
        messageFactory.show('error').then(function(){
          $scope.message = null;
        });
      });
    };
    /***********************************************
     ***********************************************
     * Functions Specific to Custom Scores
     ***********************************************
     **********************************************/
    /***
     * sets the object structure and defaults for the new Custom Score
     ***/
    $scope.score = {
      currentScore: 0,
      config: {
        type: 'number',
        color: '#000'
      }
    };
    /***
     * try to generate the new custom score, retuns an error when invalid data is submitted
     ***/
    $scope.newScore = function () {
      try {
        highScoreFactory.newScore($scope.score);
        $location.path('/app/highscores');
      } catch (error) {
        $scope.message = messageFactory.format(error);
        messageFactory.show('error').then(function(){
          $scope.message = null;
        });
      }
    }
  });
