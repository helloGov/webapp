/*
 * load the core server and app modules
 *
 */
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var config = require('./conf/config');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./app/models/user');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var facebookAuthHandler = require('./app/controllers/authentication').facebookAuthHandler;
var fs = require('fs');
var routes = require('./app/routes');

var app = express();

const currentEnv = app.get('env');
const localMongoUri = `mongodb://localhost:27017/hellogov`;
const mongoUri = `mongodb://${config.dbUser}:${config.dbPassword}@${config.db}-shard-00-00-5sypa.mongodb.net:27017,${config.db}-shard-00-01-5sypa.mongodb.net:27017,${config.db}-shard-00-02-5sypa.mongodb.net:27017/${config.db}-${config.dbStage}?ssl=true&replicaSet=helloGov-shard-0&authSource=admin&retryWrites=true`;

if (currentEnv === 'development') {
    mongoose.connect(localMongoUri);
} else {
    mongoose.connect(mongoUri, { useNewUrlParser: true });
}
mongoose.connection.on('error', function (err) {
    console.log('Mongo connection error', err.message);
});
mongoose.connection.once('open', function callback() {
    console.log('Connected to MongoDB');
});

if (currentEnv === 'production') {
    var sessionStore = new MongoStore({
        url: `${mongoUri}`,
        touchAfter: 0
    });
} else {
    var sessionStore = new MongoStore({
        url: localMongoUri,
        touchAfter: 0
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = config.appPort;

// static assets
if (app.get('env') === 'development') {
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config');
    var compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    app.use(
        sassMiddleware({
            src: path.join(__dirname, '/public/scss'),
            dest: path.join(__dirname, '/public/build/css'),
            debug: true,
            prefix: '/build/css',
            sourceMap: true
        })
    );
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', '.hbs');
app.use(cookieParser(config.sessionSecret));
app.use(session({
    secret: config.sessionSecret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new FacebookStrategy({
    clientID: config.fbAppId,
    clientSecret: config.fbAppSecret,
    callbackURL: config.fbCallbackUrl
}, facebookAuthHandler));

passport.serializeUser(function (user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        console.log('deserializeUser: ' + JSON.stringify(user));
        done(err, user);
    });
});

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/app/views/layouts'),
    partialsDir: [
        path.join(__dirname, '/app/views/partials'),
        path.join(__dirname, '/app/views/shared')
    ],
    helpers: {
        'angular-js': function (options) {
            return options.fn();
        },
        'google-maps-api-key': function () {
            return config.googleMapsApiKey;
        }
    }
}));

app.use('/', routes);

app.listen(process.env.PORT || port);
