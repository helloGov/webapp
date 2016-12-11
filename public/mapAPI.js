    function initialize() {
        var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            document.getElementById('city2').value = place.name;
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
            data = {"latitude": latitude, "longitude": longitude};

            $.ajax({
              type: "POST",
              url: "/locateLegislator",
              data: data,
              complete: function(result) {
										var responseObject = JSON.parse(result.responseText);

										var title = responseObject.title;
										var firstName = responseObject.firstName;
										var lastName = responseObject.lastName;
										var party = responseObject.party;

										var officialTitleText = title + ". " + firstName + " " + lastName + " (" + party + ")";

                    console.log(officialTitleText);
                },
              dataType: "application/json"
            });
    })
    }
    google.maps.event.addDomListener(window, 'load', initialize);