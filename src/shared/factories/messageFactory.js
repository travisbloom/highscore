angular.module('highScoreApp')
  .factory('messageFactory', ($timeout) => {
    let currentPromise;

    return {
      show,
      format
    };
    /***
     * checks all returned messages to validate and get data from them
     * Initially needed for timeout messages, expanded to ensure messages are properly returned across the application
     * returns an object with the {err: the err message string, type: the type of message the user should see (warning, message, etc)
     ***/
    function messageText(message) {
      //if the message being returned is a formulated string
      if (typeof message === 'string') return message;
      //if an object is passed back to the message handler from $http
      if (typeof message === "object") {
        //if type and text are already defined
        if (message.text) return message.text;
        //if the error message is returned from api server
        if (message.data && message.data.userMessage) return message.data.userMessage;
        //assumes request was timed out or a connection could not be established
        return 'Your request couldn\'t be submitted because you don\'t have interwebz';
      }
    }

    function show(type) {
      if (currentPromise) $timeout.cancel(currentPromise);
      return currentPromise = $timeout(()=>{}, type === 'error' ? 3000 : 1000);
    }

    function format(msg) {
      return {
        text: messageText(msg) || 'No error was passed',
        type: msg.type || 'warning'
      };
    }

  });
