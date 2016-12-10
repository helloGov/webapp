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

app.listen(port)  