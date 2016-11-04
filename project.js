var express = require('express');
var fortune = require('./lib/fortune.js');
var weather = require('./lib/weather.js');

var app = express();

var handlebars = require('express-handlebars')
  .create({ defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
              section: function (name, options) {
                  if (!this._sections) {
                      this._sections = {};
                  }
                  this._sections[name] = options.fn(this);
                  return null;
              }
            }
  });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' &&
  req.query.test === '1';
  next();
});

app.get('/', function(req, res){
  res.render('home');
});

app.get('/about', function(req, res){
  res.render('about', {
    fortune: fortune.getFortune (),
    pageTestScript: '/qa/tests-about.js'
  });
});

app.get('/tours/hood-river', function(req, res){
  res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
});

app.use(function(req, res, next){
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weatherContext = weather.getWeatherData();
  next();
});

app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){

  console.log('Express started on http://localhost:'+ app.get('port')+ 'push Crtl-C on exit...');
});

if( app.thing === null ) console.log('Бе-е!');
