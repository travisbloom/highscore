var koa = require('koa');
var mount = require('koa-mount');
var bodyParser = require('koa-body-parser');

var app = koa();
app.use(bodyParser());
//app.use(function *() {
//  this.body = 'Hello World';
//});

app.use(mount('/facebook', require('./routes/facebook')));

app.listen(3000);