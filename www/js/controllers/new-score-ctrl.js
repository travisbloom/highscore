angular.module('starter')
  .controller('NewScoreCtrl', function($scope, highScoreFactory, dataModelFactory, $auth, $location, $ionicModal) {
    $scope.config = {
      collapsed: true,
      options: {
        type: dataModelFactory.config.type
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
