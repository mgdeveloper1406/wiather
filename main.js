// main script; coordination of the application



var hourly_forecast_chart;

window.onload = async function() {
    ui.setup();

    if (translator.language != "en") {
        translator.translate_page(translator.language);
    }

    var weather_info = await weather.fetch_weather_info(locations.current_location);
    weather.display_weather_info(weather_info)
};
