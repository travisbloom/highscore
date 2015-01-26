angular.module('highScoreApp')
  .controller('newScoreCtrl', function($scope, highScoreFactory, dataModelFactory, $ionicModal, thirdPartyFactory, $ionicLoading, $location) {
    //pull in third party options
    $scope.thirdPartyOptions = thirdPartyFactory.options;
    $scope.show = {
      //governs what tab is being shown
      customScoreTab: false
    };
    /***
     * options to choose from for newScore
     ***/
    $scope.scoreOptions = {
      type: dataModelFactory.config.type,
      icons: dataModelFactory.config.icon
    };
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
        template: '<div>Processing all of your ' + newScore.apiInfo.provider + ' data. This could take a few seconds the first time</div>'
      });
      //make an initial request to get starting score/needed metadata
      thirdPartyFactory.scoreRequest(newScore.apiInfo.provider, newScore.apiInfo.path).then(function(res) {
        $ionicLoading.hide();
        //append returned data to newScore then create it
        newScore.currentScore = res.data.score;
        newScore.metaData = res.data.metaData;
        //generate and save the new score
        highScoreFactory.newScore(newScore);
        //send user to highScores page after successful completion. Pass query param to signal successful signup
        $location.path('/app/highscores?message=newscore');
      }).catch(function() {
        $ionicLoading.hide();
        //todo expose error
        console.log('There was an error authenticating and your new provider could not be added')
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
      score: 0,
      config: {
        type: 'number'
      }
    };
    /***
     * configure icon modal for page, track modal on scope
     ***/
    $ionicModal.fromTemplateUrl('templates/modal-icons.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    /***
     * pass new icon to item config, hide modal
     ***/
    $scope.newIcon = function (icon) {
      $scope.score.config.icon = icon;
      $scope.modal.hide();
    };
    /***
     * try to generate the new custom score, retuns an error when invalid data is submitted
     ***/
    $scope.newScore = function () {
      try {
        highScoreFactory.newScore($scope.score);
      } catch (e) {
        //todo expose error
        console.log(e);
      }
    }
  });
