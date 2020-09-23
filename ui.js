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

            for (let location of locations.favorites) {
                let location_element = document.createElement("span");

                location_element.innerText = location;

                location_element.classList.add("round_corners", "clickable");

                location_element.addEventListener("click", async function() {
                    weather_info = await weather.fetch_weather_info(location);
                    weather.display_weather_info(weather_info);

                    ui.menu.hide();
                });

                let location_delete_element = document.createElement("button");

                location_delete_element.classList.add("icon-delete", "round_corners");

                location_delete_element.addEventListener("click", function() {
                    locations.remove_location(location);
                });

                favorite_locations_container.append(location_element, location_delete_element);
            }
        }
    },

    setup: function() {
        ui.menu.fill_favorite_locations_container();
        fill_daily_forecast_container();
        add_search_input_event();
        setup_weather_chart();


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
                    '<div class="additional_info_container hidden">More info</div>' +
                    '</div>';
            }

            var additional_info_containers = document.querySelectorAll("#daily_forecast_container .daily_forecast_row");

            for (let element of additional_info_containers) {
                element.addEventListener("click", function(e) {
                    element.getElementsByClassName("additional_info_container")[0].classList.toggle("hidden")
                });
            }
        }


        function setup_weather_chart() {
            Chart.defaults.global.animation.easing = "easeInOutCubic";

            var ctx = document.getElementById("hourly_forecast_chart").getContext("2d");

            hourly_forecast_chart = new Chart(ctx, {
                type: "line",

                data: {
                    datasets: [{
                        data: [],
                        yAxisID: "A1",
                        borderWidth: 4,
                        borderColor: "hsl(185, 25%, 30%)",
                        backgroundColor: "hsla(185, 25%, 50%, 0.5)",
                        pointRadius: 0,
                        pointBorderWidth: 0,
                        pointHitRadius: 5,
                        pointHoverRadius: 8,
                        pointHoverBorderWidth: 2,
                        borderCapStyle: "round",
                        lineJointStyle: "round",
                        clip: 0,
                        fill: "origin",
                        tension: 0.1
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
                        intersect: false
                    },

                    tooltips: {
                        mode: "index",
                        intersect: false,
                        titleFontFamily: "Montserrat",
                        bodyFontFamily: "Montserrat",
                        displayColors: false,

                        callbacks: {
                            beforeLabel: function(tooltipItem, data) {
                                var data = data.datasets[0].data;

                                var temperature = data[tooltipItem.index].y + " °C";

                                return temperature;
                            },

                            label: function(tooltipItem, data) {
                                var data = data.datasets[0].data;

                                var description = data[tooltipItem.index].description;

                                return description;
                            },

                            afterLabel: function(tooltipItem, data) {
                                var data = data.datasets[0].data;

                                var precipitation = data[tooltipItem.index].precipitation;

                                if (precipitation === 0) {
                                    return false
                                }

                                return precipitation + " mm"
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
                            ticks: {
                                maxTicksLimit: 6,
                                fontFamily: "Montserrat",
                                fontColor: "hsl(185, 25%, 20%)",
                                callback: function(value) {
                                    return value + "°";
                                }
                            },
                            id: "A1",
                            position: "left",
                        }]
                    }
                }
            });
        }
    }
};
