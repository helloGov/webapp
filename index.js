/*
 * load the core server and app modules 
 *
 */

const path = require('path');
const express = require('express');

const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
const port = 8080; //TODO  put in config

app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '/app/views/layouts'), 
  partialsDir: [path.join(__dirname, '/app/views/partials'),
  				path.join(__dirname, '/app/views/shared')]
})); 

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', '.hbs');
var routes = require('./app/routes');
app.use('/', routes);

app.listen(port);
