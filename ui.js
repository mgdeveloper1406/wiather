// Setup and coordination of UI processes



var ui = {
    menu: {
        show: function() {
            document.getElementById("menu").classList.remove("hidden");
            document.getElementById("overlay").classList.remove("hidden");
        },

        hide: function() {
            document.getElementById("menu").classList.add("hidden");
            document.getElementById("overlay").classList.add("hidden");
        },

        fill_favorite_locations_container: function() {
            var favorite_locations_container = document.getElementById("favorite_locations_container");

            favorite_locations_container.innerHTML = "";

            var favorite_locations = configuration.data.favorite_locations;

            if (favorite_locations.length > 0) {
                for (let location of favorite_locations) {
                    let location_element = document.createElement("button");

                    location_element.innerText = location;

                    location_element.classList.add("round_corners", "favorite_location_button");

                    location_element.addEventListener("click", async function() {
                        var weather_info = await weather.fetch_weather_info(location);

                        if (weather_info !== false) {
                            weather.display_weather_info(weather_info);
                        }

                        ui.menu.hide();
                    });

                    let location_delete_element = document.createElement("button");

                    location_delete_element.classList.add("icon-delete", "round_corners", "negative");
                    location_delete_element.setAttribute("aria-label", "Delete")

                    location_delete_element.addEventListener("click", function() {
                        locations.remove_location(location);
                    });

                    favorite_locations_container.append(location_element, location_delete_element);
                }
            }

            else {
                favorite_locations_container.innerHTML = `<i>${translator.translate_key("no_favorite_locations", configuration.data.language)}</i>`;
            }
        }
    },

    popup: {
        show: function(id) {
            ui.menu.hide();

            document.getElementById(id).classList.remove("hidden");
            document.getElementById("overlay").classList.remove("hidden");
        },

        hide: function() {
            var popups = document.getElementsByClassName("popup");

            for (let popup of popups) {
                popup.classList.add("hidden");
            }

            document.getElementById("overlay").classList.add("hidden");
        },
    },

    save_settings: function() {
        var language_inputs = document.querySelectorAll("#language_inputs_container > input");

        for (let input of language_inputs) {
            if (input.checked === true) {
                configuration.data.language = input.value;
            }
        }

        var unit_inputs = document.querySelectorAll("#units_inputs_container > input");

        for (let input of unit_inputs) {
            if (input.checked === true) {
                configuration.data.units = input.value;
            }
        }

        configuration.save();

        if (confirm(translator.translate_key("confirm_page_refresh", configuration.data.language))) {
            window.location.reload();
        }
    },

    setup: function() {
        ui.menu.fill_favorite_locations_container();
        fill_daily_forecast_container();
        add_search_input_event();
        setup_settings_inputs();
        setup_weather_chart();
        setup_precipitation_chart();


        function add_search_input_event() {
            document.getElementById("location_input").addEventListener("keypress", function(e) {
                if (e.keyCode == 13) {
                    weather.search();
                    ui.menu.hide();
                }
            });
        }


        function fill_daily_forecast_container() {
            var daily_forecast_container = document.getElementById("daily_forecast_container");

            for (let i = 0; i < 8; i++) {
                daily_forecast_container.innerHTML += 
                    '<div class="daily_forecast_row">' +
                    '<span class="day_label"></span>' +
                    '<span class="weather_icon wi"></span>' +
                    '<div class="temperature_span_container"><div class="temperature_span_bar"></div></div>' +
                    '<div class="accordeon_arrow icon-angle-down"></div>' +
                    '<div class="additional_info_container hidden">More info</div>' +
                    '</div>';
            }

            var additional_info_containers = document.querySelectorAll("#daily_forecast_container .daily_forecast_row");

            for (let element of additional_info_containers) {
                element.addEventListener("click", function(e) {
                    element.getElementsByClassName("additional_info_container")[0].classList.toggle("hidden");
                    element.getElementsByClassName("accordeon_arrow")[0].classList.toggle("icon-angle-down");
                    element.getElementsByClassName("accordeon_arrow")[0].classList.toggle("icon-angle-up");
                });
            }
        }


        function setup_settings_inputs() {
            var language_inputs = document.querySelectorAll("#language_inputs_container > input");

            for (let input of language_inputs) {
                if (input.value == configuration.data.language) {
                    input.checked = true;
                }
            }

            var unit_inputs = document.querySelectorAll("#units_inputs_container > input");

            for (let input of unit_inputs) {
                if (input.value == configuration.data.units) {
                    input.checked = true;
                }
            }
        }


        function setup_weather_chart() {
            Chart.defaults.global.animation.easing = "easeInOutCubic";

            var ctx = document.getElementById("hourly_temperature_weather_chart").getContext("2d");

            hourly_temperature_weather_chart = new Chart(ctx, {
                type: "line",

                data: {
                    datasets: [{
                        data: [],
                        yAxisID: "A1",
                        borderWidth: 3,
                        borderColor: "hsl(185, 25%, 30%)",
                        backgroundColor: "hsla(185, 25%, 50%, 0.3)",
                        hoverBackgroundColor: "hsl(185, 25%, 30%)",
                        pointRadius: 0,
                        pointBorderWidth: 0,
                        pointHitRadius: 5,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 0,
                        borderCapStyle: "round",
                        lineJointStyle: "round",
                        clip: 0,
                        fill: "origin"
                    },
                    {
                        data: [],
                        yAxisID: "A2",
                        type: "bar",
                        barThickness: 1,
                        backgroundColor: "rgba(0,0,0,0.1)",
                    }]
                },

                options: {
                    layout: {
                        padding: {left: -5, top: -5, right: -15, bottom: -5},
                    },

                    legend: {
                        display: false
                    },

                    responsive: true,

                    hover: {
                        mode: "index",
                        intersect: false,
                        animationDuration: 0
                    },

                    tooltips: {
                        mode: "index",
                        intersect: false,
                        titleFontFamily: "Montserrat",
                        bodyFontFamily: "Montserrat",
                        displayColors: false,
                        position: "nearest",

                        callbacks: {
                            beforeLabel: function(tooltipItem, data) {
                                if (tooltipItem.datasetIndex != 0) return false;

                                var data = data.datasets[0].data;

                                var temperature = data[tooltipItem.index].y + function() {
                                    if (configuration.data.units == "metric") {
                                        return " °C";
                                    }

                                    else if (configuration.data.units == "imperial") {
                                        return " °F";
                                    }
                                }();

                                return temperature;
                            },

                            label: function(tooltipItem, data) {
                                if (tooltipItem.datasetIndex != 0) return false;

                                var data = data.datasets[0].data;

                                var description = data[tooltipItem.index].description;

                                return description;
                            }
                        }
                    },

                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 12,
                                maxRotation: 0,
                                fontFamily: "Montserrat",
                                fontColor: "hsl(185, 25%, 20%)"
                            },
                            type: "time",
                            time: {
                                displayFormats: {
                                    hour: "HH"
                                },
                                tooltipFormat: "ddd, DD. MMM, HH:mm"
                            }
                        }],

                        yAxes: [{
                            id: "A1",
                            ticks: {
                                maxTicksLimit: 6,
                                fontFamily: "Montserrat",
                                fontColor: "hsl(185, 25%, 20%)",
                                callback: function(value) {
                                    return value + "°";
                                }
                            },
                            position: "left"
                        },
                        {
                            id: "A2",
                            display: false,
                            ticks: {
                                min: 0,
                                max: 1,
                            }
                        }]
                    }
                }
            });
        }


        function setup_precipitation_chart() {
            var ctx = document.getElementById("hourly_precipitation_chart");

            hourly_precipitation_chart = new Chart(ctx, {
                type: "line",
                data: {
                    datasets: [
                        {
                            data: [],
                            yAxisID: "B1",
                            type: "bar",
                            backgroundColor: "hsla(185, 25%, 50%, 0.5)",
                            hoverBackgroundColor: "hsla(185, 25%, 30%)",
                            order: 2
                        },
                        {
                            data: [],
                            yAxisID: "B2",
                            type: "line",
                            backgroundColor: "rgba(0,0,0,0)",
                            borderWidth: 3,
                            borderColor: "hsl(185, 25%, 30%)",
                            pointRadius: 0,
                            pointHitRadius: 5,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "hsl(185, 25%, 30%)",
                            borderCapStyle: "round",
                            order: 1
                        },
                        {
                            data: [],
                            yAxisID: "B3",
                            type: "bar",
                            barThickness: 1,
                            backgroundColor: "rgba(0,0,0,0.1)"
                        }
                    ]
                },
                options: {
                    layout: {
                        padding: {left: -5, top: -5, right: -5, bottom: -5}
                    },

                    legend: {
                        display: false
                    },

                    hover: {
                        mode: "index",
                        intersect: false,
                        animationDuration: 0
                    },

                    gridLines: {
                        display: false
                    },

                    tooltips: {
                        mode: "index",
                        intersect: false,
                        titleFontFamily: "Montserrat",
                        bodyFontFamily: "Montserrat",
                        displayColors: false,
                        position: "average",

                        callbacks: {
                            beforeLabel: function(tooltipItem, data) {
                                if (tooltipItem.datasetIndex != 0) return false;

                                var data = data.datasets[1].data;

                                var probability = Math.round(data[tooltipItem.index].y * 100) + "%";

                                var label_text = translator.translate_key("rain_probability", configuration.data.language) + ": " + probability;

                                return label_text;
                            },

                            label: function(tooltipItem, data) {
                                if (tooltipItem.datasetIndex != 0) return false;

                                var data = data.datasets[0].data;

                                var precipitation = data[tooltipItem.index].y + " mm";

                                var label_text = translator.translate_key("precipitation", configuration.data.language) + ": " + precipitation;

                                return label_text;
                            }
                        }
                    },

                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 12,
                                maxRotation: 0,
                                fontFamily: "Montserrat",
                                fontColor: "hsl(185, 25%, 20%)"
                            },
                            type: "time",
                            time: {
                                displayFormats: {
                                    hour: "HH"
                                },
                                tooltipFormat: "ddd, DD. MMM, HH:mm"
                            }
                        }],

                        yAxes: [{
                            id: "B1",
                            position: "left",
                            ticks: {
                                startAtZero: true,
                                min: 0,
                                maxTicksLimit: 6,
                                fontFamily: "Montserrat",
                                fontColor: "hsl(185, 25%, 20%)",
                                callback: function(value) {
                                    return value;// + " mm";
                                }
                            }
                        },
                        {
                            id: "B2",
                            position: "right",
                            gridLines: {
                                color: "rgba(0,0,0,0)",
                            },
                            ticks: {
                                startAtZero: true,
                                max: 1,
                                min: 0,
                                maxTicksLimit: 6,
                                fontFamily: "Montserrat",
                                fontColor: "hsl(185, 25%, 20%)",
                                callback: function(value) {
                                    return value * 100 + "%";
                                }
                            }
                        },
                        {
                            id: "B3",
                            display: false,
                            ticks: {
                                min: 0,
                                max: 1,
                            }
                        }]
                    }
                }
            });
        }
    }
};
