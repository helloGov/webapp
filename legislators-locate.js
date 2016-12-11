

function locateTheLegislator(latitude, longitude, response) {
  var api = require("sunlight-congress-api");

  var success = function(data) {
    sunlightOutput = data;

    var representative = data.results[0];
    var title = representative.title;
    var firstName = representative.first_name;
    var lastName = representative.last_name;
    var telephoneNumber = representative.phone;
    var party = representative.party;

    legislator = {
      "representative": representative,
      "title": title,
      "firstName": firstName,
      "lastName": lastName,
      "telephoneNumber": telephoneNumber,
      "party": party
    };
    
    response.send(JSON.stringify(legislator));
  }

  api.init("");

  api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);
}

module.exports.locateTheLegislator = locateTheLegislator;
