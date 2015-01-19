var url = require('url');
var querystring = require('querystring');
var express = require('express');
var request = require('request');
var config = require('../config');
var router = express.Router();
var fbAuth = 'https://graph.facebook.com/oauth/access_token';
/* GET home page. */
router.post('/fb', function(req, res, next) {
  var authUrl;
  //add client secret to the request
  if (!req.body || !req.body.code || !req.body.clientId || !req.body.redirectUri)
    res.status(400).json({userMessage: 'error sent to the API server'});
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
    if (error) return res.status(500).json({userMessage: 'error returned from facebook'});
    //convert returned query params to json
    res.json(querystring.parse(body));
  });
});

module.exports = router;
