var url = require('url');
var querystring = require('querystring');
var express = require('express');
var request = require('request-promise');
var config = require('../config');
var response = require('./standard-response');
var router = express.Router();
var fbUri = 'https://graph.facebook.com/v2.2';

function generateUrl(path, queryParams) {
  var newUrl =  url.parse(fbUri + path);
  newUrl.query.access_token = token;
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
  }).then(function(returnedData) {
      //convert returned query params to json
      res.json(querystring.parse(returnedData));
    })
    .catch(function(returnedData) {
      response.error(res, {
        status: 400,
        internalMessage: 'facebook rejected request',
        details: returnedData.error
      });
    });
});

router.use(function(req, res, next) {
  if (!req.query || !req.query.access_token)
    return response.error({internalMessage: 'fb auth token not passed'});
  next();
});
router.get('/pictures/likes', likesRequest);
router.get('/status/likes', likesRequest);
function likesRequest(req, res) {
  var fbReq;
  if (req.originalUrl.indexOf('pictures') !== -1) {
    fbReq = '/me/photos/uploaded';
  } else {
    fbReq = '/me/feed';
  }
  fbReq = url.parse(fbUri + fbReq);
  fbReq.query = {
    access_token: req.query.access_token,
    limit: 3000,
    fields: 'likes.limit(1).summary(true)'
  };
  if (req.query.since) fbReq.query.since = req.query.since;
  fbReq = url.format(fbReq);
  request(fbReq)
    //todo pipe compute to lambda
    .then(function(response) {
      var currentScore = 0, currentItemId = null;
      response = JSON.parse(response);
      //iterate over all the returned items
      response.data.forEach(function(item) {
        if (!item.likes || !item.likes.summary) return;
        var likeScore = +item.likes.summary.total_count;
        //if totalLikes exceeds the previous max
        if (likeScore > currentScore) {
          currentScore = likeScore;
          currentItemId = item.id;
        }
      });
      //if previously queried data is still the highest
      if (req.query.since && req.query.currentScore > currentScore) {
        currentScore = req.query.currentScore;
        currentItemId = req.query.currentItemId;
      }
      //convert returned query params to json
      res.json({
        test: response,
        score: currentScore,
        metaData: {
          reqTimestamp: new Date().toJSON(),
          queryParams: {
            //tracks the last id queried by facebook, reduces redundant query results from returning
            //e.g. prevents previously calculated photos from being queried
            since: Math.round(+new Date()/1000),
            //tracks the current max, will override returned max if since is present
            currentScore: currentScore,
            currentItemId: currentItemId
          }
        }
      });
    })
    .catch(function(err) {
      response.error(res, {
        internalMessage: 'facebook rejected request',
        details: err
      });
    });
}
module.exports = router;
