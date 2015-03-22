"use strict";

angular.module("highScoreApp").directive("scoreConfigOptions", function ($ionicModal, optionsFactory) {
  return {
    restrict: "E",
    templateUrl: "templates/components/score-config-options.html",
    scope: {
      //score object being referenced
      score: "="
    },
    controller: function controller($scope) {
      /***
       * options to choose from for newScore
       ***/
      $scope.scoreOptions = optionsFactory;
      /***
       * configure icon modal for page, track modal on $scope
       ***/
      $ionicModal.fromTemplateUrl("templates/components/modal-icons.html", {
        scope: $scope,
        animation: "slide-in-up"
      }).then(function (modal) {
        return $scope.iconModal = modal;
      });
      /***
       * pass new icon to item config, hide modal
       ***/
      $scope.newIcon = function (icon) {
        $scope.score.config.icon = icon;
        $scope.iconModal.hide();
      };
      /***
       * configure color modal for page, track modal on $scope
       ***/
      $ionicModal.fromTemplateUrl("templates/components/modal-colors.html", {
        scope: $scope,
        animation: "slide-in-up"
      }).then(function (modal) {
        return $scope.iconModal = modal;
      });
      /***
       * pass new color to item config, hide modal
       ***/
      $scope.newColor = function (color) {
        $scope.score.config.color = color;
        $scope.colorModal.hide();
      };
    }
  };
});