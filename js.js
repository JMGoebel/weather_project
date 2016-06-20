/*global $, console */

$(document).ready(function () {
  "use strict";
  function getWeather() {
    var openWeatherAPI = "http://api.openweathermap.org/data/2.5/weather?",
      weatherData;
    weatherData = $.getJSON(openWeatherAPI, {q: "Kansas City",
                                             appid: "2102d3e0ed083053990492f54bbf38e2"})
      .done(function (data) {
        $("#data").text("openWeather Data: " + data.coord.lon);
      })
      .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        $("#data").text("Request Failed: " + err);
      });
    return weatherData;
  }
});


