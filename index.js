const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
var bodyParser = require('body-parser');
const locate = require("./legislators-locate.js");

const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = 8080

hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials')

app.use(express.static('public'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (request, response) => {
  response.render('home', {
    name: 'Wilson'
  })
})

app.get('/campaign', (request, response) => {
  response.render('home', {
    name: 'Taco',
    layout: 'campaign'
  })
})

app.post('/locateLegislator', (request, response) => {
	latitude = request.body.latitude;
	longitude = request.body.longitude;

	response.setHeader('Content-Type', 'application/json')
	locate.locateTheLegislator(latitude, longitude, response);
})




app.listen(port)
