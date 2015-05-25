export default function mainController(notificationFactory) {
  this.notificationPassive = notificationFactory.getModel();
  this.hideNotification = notificationFactory.hide;
}
