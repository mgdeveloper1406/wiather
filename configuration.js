// Management of user data stored using localStorage



var configuration = {
    data: {},

    load: function() {
        var data = localStorage.getItem("weather_config");

        if (data === null) {
            configuration.data = {
                language: "en",
                units: "metric",
                favorite_locations: ["London", "Paris", "Berlin", "Rome"]
            };

            configuration.save();
        }

        else {
            configuration.data = JSON.parse(data);
        }
    },

    save: function() {
        var data_string = JSON.stringify(configuration.data);
        localStorage.setItem("weather_config", data_string);
    },

    delete: function() {
        localStorage.removeItem("weather_config");
    }
};
