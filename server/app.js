var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
app.use(nocache())

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

app.get('/', function (req, res) {
  var data = {status: 'succ'};
  res.send(data);
});

app.post('/postRating', function (req, res) {
  console.log(req);
  var data = {status: 'succ'};
  res.send(data);
});
  
//Start listening 5000
app.listen(process.env.PORT || 5000);

