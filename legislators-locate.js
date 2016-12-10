

function locateTheLegislator() {
  var api = require("sunlight-congress-api");

  var success = function(data) {
    sunlightOutput = data;

    var representative = data.results[0];
    var title = representative.title;
    var firstName = representative.first_name;
    var lastName = representative.last_name;
    var telephoneNumber = representative.phone;

    console.log(title + ". " + firstName + " " + lastName + ": " + telephoneNumber);
  }

  api.init("");

  var latitude = 37.766482999;
  var longitude = -122.417305;

  api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);
}

module.exports.locateTheLegislator = locateTheLegislator;
