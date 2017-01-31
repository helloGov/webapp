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
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var secrets = require('./secrets')

mongoose.connect(`mongodb://${secrets.db_user}:${secrets.db_password}@${secrets.IP}:${secrets.port}/${secrets.db}`);
mongoose.connection.on('error', function (err) {
    console.log('Mongo connection error', err.message);
});
mongoose.connection.once('open', function callback () {
    console.log("Connected to MongoDB");
});


var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
const port = 8080; //TODO  put in config

app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

var sessionStore = new MongoStore({
  url: `${secrets.IP}:${secrets.port}/${secrets.db}`,
  touchAfter: 0
})
app.use(cookieParser(secrets.sessionSecret));
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

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', '.hbs');
require('./app/models')
var routes = require('./app/routes');

var Influencer = require('./app/models/influencer');
passport.use(new LocalStrategy(Influencer.authenticate()));
passport.serializeUser(Influencer.serializeUser());
passport.deserializeUser(Influencer.deserializeUser());



app.use('/', routes);

app.listen(port);
