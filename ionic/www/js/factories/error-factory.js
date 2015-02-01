angular.module('highScoreApp')
  .factory('errorFactory', function() {
    /***
     * checks all returned errors to validate and get data from them
     * Initially needed for timeout errors, expanded to ensure errors are properly returned across the application
     * returns an object with the {err: the err message string, type: the type of error the user should see (warning, error, etc)
     ***/
    return function(err) {
      console.log(err)
      err.type = err.type || 'warning';
      //if there was an uncaught error
      if (!err)
        return {error:'there was an error with your request, please try again later', type: err.type};
      //if the error being returned is a formulated string
      if (typeof err === 'string')
        return {error:err, type: err.type};
      //if an object is passed back to the error handler and it has a userMessage
      if (typeof err === "object" && err.data && err.data.userMessage)
        return {error:err.data.userMessage, type: err.type};
      //if an http object is passed back with a status of 0
      //assumes request was timed out or a connection could not be established
      if (typeof err === "object" && !err.data && err.status === 0)
        return {error:'Your request couldn\'t be submitted because you don\'t have interwebz', type: 'warning'};
    }
  });
