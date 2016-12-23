/*var mongoose = require('mongoose')
    ,User = mongoose.model('User')
    ,Support = mongoose.model('Support')
    ,Project = mongoose.model('Project')
    ,Request = mongoose.model('Request') */


module.exports = function (router) {
    router.get('/campaign', (request, response) => {
      response.render('campaign', {
        name: 'Taco'
      });
    });
    router.get('/', function(request, response) {
    console.log("getting /")
    response.render('home', {
        name: 'Wilson'
        });
    });
};

