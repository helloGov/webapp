const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const port = 8080

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

require("./legislators-locate.js");

///
// var api = require("sunlight-congress-api");
//
// var success = function(data){
// 	console.log(data);
// }
//
// api.init("");
//
// var latitude = 37.766482999;
// var longitude = -122.417305;
//
// api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);

// api.votes().filter("year", "2012").call(success);
///

app.listen(port)
