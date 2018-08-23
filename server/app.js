var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

try {
  app.use(bodyParser.urlencoded({ extended: false
    , limit: '5mb'
  }));
  app.use(bodyParser.json({
    limit: '5mb'
  }));
  app.use(cookieParser());
}
catch (e) {
  console.log(e);
}

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  var data = {status: 'succ'};
  res.send(data);
});

app.post('/postRating', function (req, res) {
  console.log(req.body);
  console.log(req.headers);
  var data = {status: 'succ'};
  res.send(data);
});
  
//Start listening 5000
app.listen(process.env.PORT || 5000);

