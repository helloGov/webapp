

function getRepresentative(legislators) {
  if (legislators.length == 0) {
    return null;
  }

  for (var legislatorIndex = 0; legislatorIndex < legislators.length; legislatorIndex++) {
    var legislator = legislators[legislatorIndex];
    if (legislator.title == "Rep") {
      return legislator;
    }
  }
  var firstLegislator = legislators[0];
  return firstLegislator;
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
    var responseObject = {};

    var legislators = data.results;
    var representative = getRepresentative(legislators);

    var representativeFound = (representative != null);
    responseObject.representativeFound = representativeFound;

    if (representativeFound) {
      responseObject.title = representative.title;
      responseObject.firstName = representative.first_name;
      responseObject.lastName = representative.last_name;
      responseObject.telephoneNumber = representative.phone;
      responseObject.party = representative.party;
      responseObject.bioguideId = representative.bioguide_id;
    }

    response.send(JSON.stringify(responseObject));
  }

  api.init("");

  api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);
}

module.exports.locateTheLegislator = locateTheLegislator;
