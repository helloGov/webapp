/*
 * load the core server and app modules
 *
 */

var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var secrets = require('./secrets');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var secrets = require('./secrets');
var Models = require('./app/models');
var Influencer = require('./app/models/influencer');

var routes = require('./app/routes');

mongoose.connect(`mongodb://${secrets.db_user}:${secrets.db_password}@${secrets.db_IP}:${secrets.db_port}/${secrets.db}`);
mongoose.connection.on('error', function (err) {
    console.log('Mongo connection error', err.message);
});
mongoose.connection.once('open', function callback () {
    console.log("Connected to MongoDB");
});


var app = express();
var sessionStore = new MongoStore({
  url: `mongodb://${secrets.db_user}:${secrets.db_password}@${secrets.db_IP}:${secrets.db_port}/${secrets.db}`,
  touchAfter: 0
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = secrets.app_port;  

app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', '.hbs');
app.use(cookieParser(secrets.session_secret));
app.use(session({
    secret: secrets.session_secret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '/app/views/layouts'),
  partialsDir: [path.join(__dirname, '/app/views/partials'),
  				path.join(__dirname, '/app/views/shared')],
  helpers:{
  	'angular-js': function(options) {
    return options.fn();
	}
  }
}));

passport.serializeUser(function(influencer, done) {
  console.log('serializeUser: ' + influencer._id);
  done(null, influencer._id);
});
passport.deserializeUser(function(id, done) {
  Influencer.findById(id, function(err, influencer){
    console.log('deserializeUser: ' + JSON.stringify(influencer));
      if(!err) done(null, influencer);
      else done(err, null);
    });
});

app.use('/', routes);

app.listen(port);
