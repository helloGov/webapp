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

    function submitLocation() {
        $('#form-container').hide()
        coordinates = {"latitude": $('#latitude').val(), "longitude": $('#longitude').val()};
        $.ajax({
          type: "POST",
          url: "/locateLegislator",
          data: coordinates,
          complete: function(result) {
                var responseObject = JSON.parse(result.responseText);


                var title = responseObject.title;
                var firstName = responseObject.firstName;
                var lastName = responseObject.lastName;
                var party = responseObject.party;
                var bioguideId = responseObject.bioguideId;
                var telephoneNumber = responseObject.telephoneNumber;
                var officialTitle = title + ". " + firstName + " " + lastName + " (" + party + ")";

                $("#rep-img").attr("src", "https://theunitedstates.io/images/congress/450x550/"+ bioguideId + ".jpg");
                $('#lastName').html(lastName);
                $('#officialTitle').html(officialTitle);
                $('#call-btn').attr("href", "tel:" + telephoneNumber);
                $('#rep-container').show();
            },
          dataType: "application/json"
        });

    }
    google.maps.event.addDomListener(window, 'load', initialize);
    $("#submit")[0].addEventListener('click', function() {
                submitLocation();
              });
