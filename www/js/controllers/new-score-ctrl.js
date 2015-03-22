"use strict";

angular.module("highScoreApp").controller("newScoreCtrl", function (highScoreFactory, $ionicModal, thirdPartyFactory, $ionicLoading, $location, messageFactory, userDataFactory) {
  this.message = {};
  //pull in third party options
  this.thirdPartyOptions = thirdPartyFactory.options;
  this.show = {
    //governs what tab is being shown
    customScoreTab: false
  };
  //track previously used custom scores
  this.usedCustomScores = userDataFactory.data.usedCustomScores;
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
  this.addThirdPartyScore = function (newScore) {
    var _this = this;

    //show loading page, initial loads can take some time
    $ionicLoading.show({
      template: "<div>Processing your " + newScore.apiInfo.provider + " data. This could take a few seconds the first time we get it.</div>"
    });
    //make an initial request to get starting score/needed metadata
    thirdPartyFactory.scoreRequest(newScore.apiInfo.provider, newScore.apiInfo.path).then(function (res) {
      $ionicLoading.hide();
      //append returned data to newScore then create it
      newScore.currentScore = res.data.score;
      newScore.metaData = res.data.metaData;
      //generate and save the new score
      highScoreFactory.newScore(newScore);
      //send user to highScores page after successful completion. Pass query param to signal successful signup
      $location.path("/app/highscores");
    })["catch"](function (error) {
      $ionicLoading.hide();
      _this.message = messageFactory.format(error);
      messageFactory.show("error").then(function () {
        return _this.message = null;
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
  this.score = {
    currentScore: 0,
    config: {
      type: "number",
      color: "#000"
    }
  };
  /***
   * try to generate the new custom score, retuns an error when invalid data is submitted
   ***/
  this.newScore = function () {
    var _this = this;

    try {
      highScoreFactory.newScore(this.score);
      $location.path("/app/highscores");
    } catch (error) {
      this.message = messageFactory.format(error);
      messageFactory.show("error").then(function () {
        return _this.message = null;
      });
    }
  };
});