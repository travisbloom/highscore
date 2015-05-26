export default function scoreConfigOptions($ionicModal, scoreOptions) {
  return {
    restrict: 'E',
    templateUrl: 'shared/directives/scoreConfigOptions/scoreConfigOptions.html',
    scope: {
      //score object being referenced
      scoreConfig: '='
    },
    controllerAs: 'sco',
    bindToController: true,
    controller
  };

  function controller($scope) {
    /***
     * options to choose from for newScore
     ***/
    this.scoreOptions = scoreOptions;
    /***
     * configure icon modal for page, track modal on $scope
     ***/
    $ionicModal.fromTemplateUrl('shared/directives/scoreConfigOptions/iconModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then((modal) => this.iconModal = modal);
    /***
     * pass new icon to item config, hide modal
     ***/
    this.newIcon = function(icon) {
      this.scoreConfig.icon = icon;
      this.iconModal.hide();
    };
    /***
     * configure color modal for page, track modal on $scope
     ***/
    $ionicModal.fromTemplateUrl('shared/directives/scoreConfigOptions/colorModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then((modal) => this.colorModal = modal);
    /***
     * pass new color to item config, hide modal
     ***/
    this.newColor = function(color) {
      this.scoreConfig.color = color;
      this.colorModal.hide();
    };
  }
}
