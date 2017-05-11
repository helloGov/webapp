require('./user');
require('./signup');
require('./campaign');
require('./event');
require('./passwordReset');
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
