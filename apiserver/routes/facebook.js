var url = require('url');
var querystring = require('querystring');
var express = require('express');
var request = require('request');
var config = require('../config');
var response = require('./standardResponse');
var router = express.Router();
var fbAuth = 'https://graph.facebook.com/oauth/access_token';
/* GET home page. */
router.post('/auth', function(req, res, next) {
  var authUrl;
  //add client secret to the request
  if (!req.body || !req.body.code || !req.body.clientId || !req.body.redirectUri)
    return response.error(res, {
      internalMessage: 'fb auth fields not passed',
      data: {passedBody: req.body}
    });
  //add the req json body and clientSecret as query params
  authUrl = url.parse(fbAuth);
  authUrl.query = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    client_secret: config.fb.clientSecret
  };
  authUrl = url.format(authUrl);
  console.log(authUrl);
  //submit GET to facebook
  request(authUrl, function(error, response, body) {
    if (error) {
      console.log('facebook error', error);
      return response.error(res, {
        internalMessage: 'facebook rejected request'
      });
    }
    //convert returned query params to json
    res.json(querystring.parse(body));
  });
});

router.all(function(req, res, next) {
  if (!req.query || !req.query.access_token)
   return response.error({internalMessage: 'fb auth token not passed'});
  next();
});

router.get('/recent/likes/photos', function(req, res, next) {

});
module.exports = router;
