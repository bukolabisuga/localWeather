$(document).ready(function(){
    var longitude;
    var latitude;
    var cTemp;
    var fTemp;
    var celsius;
    var farenheit;
    var switchTemp;
    var openCageUrl = '';
    var weatherUrl = '';

    // AJAX call to weather API 
    $.ajax({
        url: 'https://fcc-weather-api.glitch.me/api/current?lon=:longitude&lat=:latitude',
        type: 'GET',
        dataType: 'json',
    })

    .done(function(json){
        // if the user allows access to their location, get their current position
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                long = position.coords.longitude;
                lat = position.coords.latitude;
                openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?q='+lat+'+'+long+'&pretty=1&key=e469eea8b2874ec08fc0edb7e7cccb01';
                
                $.getJSON(openCageUrl, {format:'json'}, function(json) {
    
                    if(json.results[0].components.city === undefined) {
                        $("#location").text(json.results[0].components.state + ", " + json.results[0].components.country);
                      }
            
                      else {
                        $("#location").text(json.results[0].components.city + ", " + json.results[0].components.state);
                      }
            
                });

                weatherUrl = 'https://fcc-weather-api.glitch.me/api/current?lat='+lat+'&'+'lon='+long;
                $.getJSON(weatherUrl, {format:'json'}, function(json) {
                    switchTemp = true;
                    celsius = 'C';
                    farenheit = 'F';
                    cTemp = (json.main.temp).toFixed(1) + " &#8451";
                    fTemp = ((json.main.temp * (9/5)) + 32).toFixed(1) + " &#8457";

                    $("#fTemp").html(fTemp);
                    $("#cTemp").html(cTemp);

                    // toggle button for farenheit and celsius
                    $("button").click(function(){
                        if(switchTemp === false) {
                            $("#fTemp").html(fTemp);
                            $("#celsius").html(celsius).show();
                            switchTemp = true;
                        } else {
                            $("#fTemp").html(cTemp);
                            $("#celsius").html(farenheit).show();
                            switchTemp = false;
                        }
                    });

                    // Access image attributes to applied src for image elt, width, and height
                    $('#icon').attr('src', json.weather[0].icon);
                    $('#icon').attr('width', '75');
                    $('#icon').attr('height', '75');
                    // Provide description from JSON parsing
                    $('#description').html(json.weather[0].description);
                });
            });
        }

    });

    
});