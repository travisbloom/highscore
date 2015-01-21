exports.error = function(res, errObj) {
  res.status(errObj.status || 500).json({
    userMessage: errObj.userMessage || 'There was an error with your request, please try again later',
    internalMessage: errObj.internalMessage || this.userMessage,
    details: errObj.details || null
})
};