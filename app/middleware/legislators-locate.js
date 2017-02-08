

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
  var hbs = exphbs.create({ /* config */ });

  var success = function(data) {
    var legislators = data.results;
    var representative = getRepresentative(legislators);
    var representativeFound = (representative != null);

    responseObject = {representativeFound: representativeFound,
                      representativeInfo: representative};

    console.log(representative)

    if (representativeFound) {
      var templatePromise = hbs.getTemplate('app/views/shared/representativeForm.hbs');
    } else {
      var templatePromise = hbs.getTemplate('app/views/shared/representativeNotFoundMessage.hbs');
    }
    templatePromise.then( function(template) {
      responseObject = {representativeFound: representativeFound,
                        representativeDiv: template(representative)};
      response.send(JSON.stringify(responseObject));
    });
  }

  api.init("");
  api.legislatorsLocate().filter("latitude", latitude).filter("longitude", longitude).call(success);
}

module.exports.locateTheLegislator = locateTheLegislator;
