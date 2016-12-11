

function getRepresentative(legislators) {
  for (var legislatorIndex = 0; legislatorIndex < legislators.length; legislatorIndex++) {
    var legislator = legislators[legislatorIndex];
    if (legislator.title == "Rep") {
      return legislator;
    }
  }
  return null;
}

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

    var legislators = data.results;
    var representative = getRepresentative(legislators);
    
    var title = representative.title;
    var firstName = representative.first_name;
    var lastName = representative.last_name;
    var telephoneNumber = representative.phone;
    var party = representative.party;
    var bioguideId = representative.bioguide_id;

   legislator = {
      "title": title,
      "firstName": firstName,
      "lastName": lastName,
      "telephoneNumber": telephoneNumber,
      "party": party,
      "bioguideId": bioguideId
    };
    response.send(JSON.stringify(legislator));
  }

  api.init("");

  api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);
}

module.exports.locateTheLegislator = locateTheLegislator;
