    function initialize() {
        var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            $('#latitude').val(place.geometry.location.lat());
            $('#longitude').val(place.geometry.location.lng());
            data = {"latitude": latitude, "longitude": longitude};
      })
    }

    function submitLocation(){ 
        $('#form-container').hide()  
        coordinates = {"latitude": $('#latitude').val(), "longitude": $('#longitude').val()};  
        $.ajax({
          type: "POST",
          url: "/locateLegislator",
          data: coordinates,
          complete: function(result) {
            /*
                var responseObject = JSON.parse(result.responseText);

                var title = responseObject.title;
                var firstName = responseObject.firstName;
                var lastName = responseObject.lastName;
                var party = responseObject.party;

                var officialTitleText = title + ". " + firstName + " " + lastName + " (" + party + ")";

                console.log(officialTitleText);
                */
                $('#content-wrapper').append(result);
            },
          dataType: "application/json"
        });

    }
    google.maps.event.addDomListener(window, 'load', initialize);
    $("#submit").onclick = submitLocation;

