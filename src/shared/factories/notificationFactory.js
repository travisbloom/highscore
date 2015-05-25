export default function notificationFactory($timeout) {
  const TYPES = ['warning', 'error', 'success'];
  let currentTimeout;
  let model = {
    show: false,
    text: '',
    type: 'bar-positive'
  };
  return {
    getModel,
    show,
    hide
  };

  function getModel() {
    return model;
  }

  function hide() {
    if (currentTimeout) $timeout.cancel(currentTimeout);
    model.show = false;
  }

  function show(notification) {
    model.show = true;
    model.text = _setText(notification);
    model.type = _setType(notification);
    //reset hide timeout
    if (currentTimeout) $timeout.cancel(currentTimeout);
    $timeout(() => model.show = false, model.type === 'error' ? 8000 : 5000);
  }

  function _setType(notification) {
    let type = notification.type && TYPES.indexOf(notification.type) ? notification.type : 'warning';
    switch (type) {
      case 'warning':
        return 'bar-energized';
      case 'error':
        return 'bar-energized';
      default:
        return 'bar-positive';
    }
  }
  /***
   * attempts a number of strategies to get notification text string returned to user
   ***/
  function _setText(message) {
    //if the message being returned is a formulated string
    if (typeof message === 'string') return message;
    //if an object is passed back to the message handler from $http
    if (typeof message === 'object') {
      //if type and text are already defined
      if (message.text) return message.text;
      //if the error message is returned from api server
      if (message.data && message.data.userMessage) return message.data.userMessage;
      //assumes request was timed out or a connection could not be established
      return 'Your request couldn\'t be submitted because you don\'t have interwebz';
    }
    return 'No error was passed';
  }
}
