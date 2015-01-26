var Router = require('koa-router');
var route = new Router();
var url = require('url');
var querystring = require('querystring');
var request = require('koa-request');
var config = require('../config');

var fbAuth = 'https://graph.facebook.com/oauth/access_token';
/* GET home page. */
route.post('/auth', function *() {
  var authUrl;
  //check that all required params are present
  if (!this.request.body || !this.request.body.code || !this.request.body.clientId || !this.request.body.redirectUri)
    throw {
      internalMessage: 'fb auth fields not passed',
      data: {passedBody: this.request.body}
    };
  //add the req json body and clientSecret as query params
  authUrl = url.parse(fbAuth);
  authUrl.query = {
    client_id: this.request.body.clientId,
    redirect_uri: this.request.body.redirectUri,
    code: this.request.body.code,
    client_secret: config.fb.clientSecret
  };
  authUrl = url.format(authUrl);
  //submit GET to facebook
  var response = yield request(authUrl);
  if (response.error) throw 'facebook rejected auth request';
  this.body = response.body;
});

//route.all(function(req, res, next) {
//  if (!req.query || !req.query.access_token)
//    return response.error({internalMessage: 'fb auth token not passed'});
//  next();
//});


module.exports = route;
