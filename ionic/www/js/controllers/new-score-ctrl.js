angular.module('starter')
  .controller('NewScoreCtrl', function($scope, highScoreFactory, dataModelFactory, $auth, $location, $ionicModal) {
    $scope.auth = function(provider) {
      $auth.authenticate(provider).then(function(res){
        console.log(res);
      })
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
  });
