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
var googleMapsApiKey = require('./conf/secrets.js').google_maps_api_key;

var app = express();

var mongoUri = `mongodb://${config.db_user}:${config.db_password}@${config.db_IP}:${config.db_port}/${config.db}`;
if (app.get('env') === 'production') {
    var mongoSslOpt = {
        'server': {
            'sslValidate': false,
            'sslKey': fs.readFileSync('/etc/ssl/mongodb.pem'),
            'sslCert': fs.readFileSync('/etc/ssl/mongodb.pem')
        }
    };
    mongoose.connect(`${mongoUri}?ssl=true`, mongoSslOpt);
} else {
    mongoose.connect(mongoUri);
}
mongoose.connection.on('error', function (err) {
    console.log('Mongo connection error', err.message);
});
mongoose.connection.once('open', function callback() {
    console.log('Connected to MongoDB');
});

if (app.get('env') === 'production') {
    var sessionStore = new MongoStore({
        url: `${mongoUri}?ssl=true`,
        touchAfter: 0,
        sslValidate: false,
        sslKey: fs.readFileSync('/etc/ssl/mongodb.pem'),
        sslCert: fs.readFileSync('/etc/ssl/mongodb.pem')
    });
} else {
    var sessionStore = new MongoStore({
        url: mongoUri,
        touchAfter: 0
    });
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = config.app_port;

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
app.use(cookieParser(config.session_secret));
app.use(session({
    secret: config.session_secret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new FacebookStrategy({
    clientID: config.fb_app_id,
    clientSecret: config.fb_app_secret,
    callbackURL: config.fb_callback_url
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
            return googleMapsApiKey;
        }
    }
}));

app.use('/', routes);

app.listen(port);
