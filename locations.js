// Management of current and favorite locations



var locations = {
    current_location: "Berlin",

    favorites: ["London", "Paris", "Berlin", "Rome"],

    add_current_location: function() {
        if (locations.favorites.indexOf(locations.current_location) == -1) {
            locations.favorites.push(locations.current_location);
        }

        locations.refresh_favorite_button();

        ui.locations_container.fill();
    },

    remove_current_location: function() {
        locations.remove_location(locations.current_location);
    },

    remove_location: function(location) {
        var favorite_index = locations.favorites.indexOf(location)

        if (favorite_index >= 0) {
            locations.favorites.splice(favorite_index, 1);
        }

        locations.refresh_favorite_button();

        ui.locations_container.fill();
    },

    refresh_favorite_button: function() {
        if (locations.favorites.indexOf(locations.current_location) >= 0) {
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
