// Management of current and favorite locations



var locations = {
    current_location: "Berlin",

    add_current_location: function() {
        if (configuration.data.favorite_locations.indexOf(locations.current_location) == -1) {
            configuration.data.favorite_locations.push(locations.current_location);
            configuration.save();
        }

        locations.refresh_favorite_button();

        ui.menu.fill_favorite_locations_container();
    },

    remove_current_location: function() {
        locations.remove_location(locations.current_location);
    },

    remove_location: function(location) {
        var favorite_index = configuration.data.favorite_locations.indexOf(location)

        if (favorite_index >= 0) {
            configuration.data.favorite_locations.splice(favorite_index, 1);
            configuration.save();
        }

        locations.refresh_favorite_button();

        ui.menu.fill_favorite_locations_container();
    },

    refresh_favorite_button: function() {
        if (configuration.data.favorite_locations.indexOf(locations.current_location) >= 0) {
            var favorite_button = document.getElementById("favorite_button");
            favorite_button.classList.remove("icon-star-empty");
            favorite_button.classList.add("icon-star");
            favorite_button.onclick = locations.remove_current_location;
        }

        else {
            var favorite_button = document.getElementById("favorite_button");
            favorite_button.classList.remove("icon-star");
            favorite_button.classList.add("icon-star-empty");
            favorite_button.onclick = locations.add_current_location;
        }
    }
};
