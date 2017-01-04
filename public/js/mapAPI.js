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
        $('#form-container').hide();
        $('#not-found-container').hide();

        coordinates = {"latitude": $('#latitude').val(), "longitude": $('#longitude').val()};
        $.ajax({
          type: "GET",
          url: "/locateLegislator",
          data: coordinates,
          complete: function(result) {
                var responseObject = JSON.parse(result.responseText);
                var representativeFound = responseObject.representativeFound;
                representativeDiv = document.createElement('div');
                representativeDiv.innerHTML = responseObject.representativeDiv;
                document.body.appendChild(representativeDiv);
                $('#rep-container').show();
              },
          dataType: "application/json"
        });

    }
    google.maps.event.addDomListener(window, 'load', initialize);
    $("#submit")[0].addEventListener('click', function() {
                submitLocation();
              });
