angular.module('highScoreApp')
    .controller('MainController', function(notificationFactory) {
      this.notificationPassive = notificationFactory.getModel();
      this.hideNotification = notificationFactory.hide;
  });
