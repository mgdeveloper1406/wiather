// dictionary and functions for translating the application into other languages



var translator = {
    dictionary: {
        "en": {
            "48_hours": "48 hours",
            "temperature": "Temperature",
            "7_days": "7 days",
            "locations": "Locations",
            "favorite_locations": "Favorite Locations",
            "search_location": "Search Location",
            "today": "Today",
            "mon": "Mon",
            "tue": "Tue",
            "wed": "Wed",
            "thu": "Thu",
            "fri": "Fri",
            "sat": "Sat",
            "sun": "Sun",
            "settings": "Settings",
            "language": "Language",
            "english": "English",
            "german": "German",
            "units": "Units",
            "metric": "Metric",
            "imperial": "Imperial",
            "other": "Other",
            "rain_probability": "Rain probability",
            "precipitation": "Precipitation",
            "wind": "Wind",
            "humidity": "Humidity",
            "air_pressure": "Air pressure",
            "close": "Close",
            "save": "Save",
            "delete_personal_data": "Delete personal data",
            "delete_personal_data_confirmation": "Your personal data is going to be removed from this application.",
            "no_favorite_locations": "No favorite locations",
            "confirm_page_refresh": "The page is going to be refreshed in order to apply the changes."
        },

        "de": {
            "48_hours": "48 Stunden",
            "temperature": "Temperatur",
            "7_days": "7 Tage",
            "locations": "Orte",
            "favorite_locations": "Lieblingsorte",
            "search_location": "Ort suchen",
            "today": "Heute",
            "mon": "Mon",
            "tue": "Die",
            "wed": "Mit",
            "thu": "Don",
            "fri": "Fre",
            "sat": "Sam",
            "sun": "Son",
            "settings": "Einstellungen",
            "language": "Sprache",
            "english": "Englisch",
            "german": "Deutsch",
            "units": "Einheiten",
            "metric": "Metrisch",
            "imperial": "Imperial",
            "other": "Andere",
            "rain_probability": "Regenwarsch.",
            "precipitation": "Niederschlag",
            "wind": "Wind",
            "humidity": "Luftfeuchtigkeit",
            "air_pressure": "Luftdruck",
            "close": "Schließen",
            "save": "Speichern",
            "delete_personal_data": "Persönliche Daten löschen",
            "delete_personal_data_confirmation": "Ihre persönlichen Daten werden von dieser Anwendung gelöscht.",
            "no_favorite_locations": "Keine Lieblingsorte",
            "confirm_page_refresh": "Die Seite wird neu geladen, um die Änderungen zu übernehmen."
        }
    },

    translate_page: function(language) {
        var elements_to_translate = document.querySelectorAll("[data-translator-key]");

        for (let element of elements_to_translate) {
            var translation = translator.dictionary[language][element.getAttribute("data-translator-key")];
            element.innerText = translation;
        }

        document.getElementById("location_input").setAttribute("placeholder", translator.translate_key("search_location", language));

        document.documentElement.lang = language;
    },

    translate_key: function(key, language) {
        var string = translator.dictionary[language][key];
        return string
    }
};

