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

router.get('/pictures/likes', function(req, res) {
  var fbReq = url.parse(fbUri + '/me/photos/uploaded');
  fbReq.query = {
    access_token: req.query.access_token,
    limit: 3000,
    fields: 'likes.limit(1).summary(true)'
  };
  if (req.query.before) fbReq.query.before = req.query.before;
  fbReq = url.format(fbReq);
  request(fbReq)
    //todo pipe compute to lambda
    .then(function(response) {
      var maxLikes = 0, maxPhoto = null;
      response = JSON.parse(response);
      //iterate over all the returned photos
      response.data.forEach(function(photo) {
        if (!photo.likes || !photo.likes.summary) return;
        var likesCount = photo.likes.summary.total_count;
        //if totalLikes exceeds the previous max
        if (likesCount > maxLikes) {
          maxLikes = likesCount;
          maxPhoto = photo.id;
        }
      });
      //if previously queried data is still the max
      if (req.query.before && req.query.currentMax > maxLikes) {
        maxLikes = req.query.currentMax;
        maxPhoto = req.query.currentPhoto;
      }
        //convert returned query params to json
      res.json({
        score: +maxLikes,
        metaData: {
          reqTimestamp: new Date().toJSON(),
          photoId: maxPhoto,
          queryParams: {
            //tracks the last id queried by facebook, reduces redundant query results from returning
            //e.g. prevents previously calculated photos from being queried
            before: response.paging && response.paging.cursors && response.paging.cursors.before ? response.paging.cursors.before : req.query.before || null,
            //tracks the current max, will override returned max if before is present
            currentMax: +maxLikes,
            currentPhoto: maxPhoto
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
});
module.exports = router;
