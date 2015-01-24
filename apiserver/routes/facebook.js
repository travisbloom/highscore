var url = require('url');
var querystring = require('querystring');
var express = require('express');
var request = require('request-promise');
var config = require('../config');
var response = require('./standardResponse');
var router = express.Router();
var fbUri = 'https://graph.facebook.com';

function generateUrl(path, token) {
  var newUrl =  url.parse(fbUri + path);
  if (!newUrl.query) newUrl.query = {};
  newUrl.query.access_token = token;
  console.log(url.format(newUrl))
  return url.format(newUrl);
}
/* GET home page. */
router.post('/auth', function(req, res, next) {
  //add client secret to the request
  if (!req.body || !req.body.code || !req.body.clientId || !req.body.redirectUri)
    return response.error(res, {
      internalMessage: 'fb auth fields not passed',
      data: {passedBody: req.body}
    });
  //submit POST to facebook
  request({
    method: 'POST',
    uri: fbUri + '/oauth/access_token',
    //reformat json body, add client_secret
    json: {
      client_id: req.body.clientId,
      redirect_uri: req.body.redirectUri,
      code: req.body.code,
      client_secret: config.fb.clientSecret
    }
  }).then(function(response) {
      console.log(response)
      //convert returned query params to json
      res.json(querystring.parse(response));
    })
    .catch(function(err) {
      response.error(res, {
        status: 400,
        internalMessage: 'facebook rejected request'
      });
    });
});

router.use(function(req, res, next) {
  if (!req.query || !req.query.access_token)
    return response.error({internalMessage: 'fb auth token not passed'});
  next();
});

router.get('/pictures/likes', function(req, res) {
  request(generateUrl('/me', req.query.access_token))
    .then(function(response) {
      //convert returned query params to json
      res.json(JSON.parse(response));
    })
    .catch(function(err) {
      response.error(res, {
        internalMessage: 'facebook rejected request'
      });
    });
});
module.exports = router;
