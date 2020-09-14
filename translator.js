// dictionary and functions for translating the application into other languages



var translator = {
    language: "en",

    dictionary: {
        "en": {
            "weather": "Weather",
            "48_hours": "48 hours",
            "7_days": "7 days",
            "locations": "Locations",
            "favorite_locations": "Favorite Locations",
            "search_location": "Search Location",
            "today": "Today",
            "monday": "Monday",
            "tuesday": "Tuesday",
            "wednesday": "Wednesday",
            "thursday": "Thursday",
            "friday": "Friday",
            "saturday": "Saturday",
            "sunday": "Sunday"
        },

        "de": {
            "weather": "Wetter",
            "48_hours": "48 Stunden",
            "7_days": "7 Tage",
            "locations": "Orte",
            "favorite_locations": "Lieblingsorte",
            "search_location": "Ort suchen",
            "today": "Heute",
            "monday": "Montag",
            "tuesday": "Dienstag",
            "wednesday": "Mittwoch",
            "thursday": "Donnerstag",
            "friday": "Freitag",
            "saturday": "Samstag",
            "sunday": "Sonntag"
        }
    },

    translate_page: function(language) {
        var elements_to_translate = document.querySelectorAll("[data-translator-key]");

        for (let element of elements_to_translate) {
            var translation = translator.dictionary[language][element.getAttribute("data-translator-key")];
            element.innerText = translation;
        }

        document.getElementById("location_input").setAttribute("placeholder", translator.translate_key("search_location", language));
    },

    translate_key: function(key, language) {
        var string = translator.dictionary[language][key];
        return string
    }
};

