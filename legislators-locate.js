

function locateTheLegislator(latitude, longitude, response) {
  var api = require("sunlight-congress-api");
  var exphbs = require('express-handlebars');
const express = require('express')
  var hbs = exphbs.create({ /* config */ });
  app = express()
// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

  var success = function(data) {
    sunlightOutput = data;

    var representative = data.results[0];
    var title = representative.title;
    var firstName = representative.first_name;
    var lastName = representative.last_name;
    var telephoneNumber = representative.phone;
    var party = representative.party;
    var bioguideId = representative.bioguide_id;

    temp = hbs.getTemplate('partials/representativeForm', {
      title: representative.title,
      firstName: representative.firstName,
      lastName: representative.lastName,
      telephoneNumber: representative.telephoneNumber,
      party: representative.party,
      bioguideId: representative.bioguideId }
      );
    response.render(temp);
    /*
    response.render('partials/representativeForm', {
      "title": title,
      "firstName": firstName,
      "lastName": lastName,
      "telephoneNumber": telephoneNumber,
      "party": party,
      "bioguideId": bioguideId }
    );
    */
/*
    response.render('partials/representativeForm', {
      title: representative.title,
      firstName: representative.firstName,
      lastName: representative.lastName,
      telephoneNumber: representative.telephoneNumber,
      party: representative.party,
      bioguideId: representative.bioguideId }
    ); */
  }

  api.init("");

  api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);
}

module.exports.locateTheLegislator = locateTheLegislator;
