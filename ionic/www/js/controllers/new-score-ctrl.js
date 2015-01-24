angular.module('starter')
  .controller('NewScoreCtrl', function($scope, highScoreFactory, dataModelFactory, authFactory, $ionicModal, thirdPartyFactory) {
    //pull in third party options
    $scope.thirdPartyOptions = thirdPartyFactory.providers;
    //add a new third party score
    $scope.addThirdPartyScore = function(newScore) {
      authFactory.getAuth(newScore.apiInfo.provider).then(function(){
        highScoreFactory.newScore(newScore);
      }).catch(function() {
        //todo expose error
        console.log('There was an error authenticating and your new provider could not be added')
      });
    };
    $scope.customView = false;
    $scope.config = {
      options: {
        type: dataModelFactory.config.type
      }
    };
    $scope.item = {
      score: 0,
      config: {
        type: 'number'
      }
    };
    //icon modal configuration/injection
    $ionicModal.fromTemplateUrl('templates/modal-icons.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.icons = dataModelFactory.config.icon;

    $scope.newIcon = function (icon) {
      $scope.item.config.icon = icon;
      $scope.modal.hide();
    };
    $scope.closeIconModal = function () {
      $scope.modal.hide();
    };
    $scope.newScore = function () {
      try {
        highScoreFactory.newScore($scope.item);
      //todo expose error?
      } catch (e) {
        console.log(e);
      }
    }
  });
