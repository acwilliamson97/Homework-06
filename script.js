var apiKey = "457cbbad81bb1f84bf029b7dd8674602";
var placeInput = "San Diego";
var place = "San Diego";
var buttonsReturned = [];
var buttons = [];
var i = 0;

$(".append-city").append("<button class='history'>" + place + "</button> <br>")

function appendCityButton() {
    if (placeInput != "") {
        place = placeInput;
        if (buttons.includes(place)) {
            return;
        } else {
            $(".append-city").append("<button class='history'>" + place + "</button> <br>")
            buttons.push(place);
            localStorage.setItem("cities", JSON.stringify(buttons));
        }
    } else {
        return;
    }
}

function currentWeather() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&appid=" + apiKey,
        method: "GET"
    }).then(function (response) {
        $("#city-name").text(response.name + " " + moment().month() + "/" + moment().date() + "/" + moment().year());
        $("#temperature").text("Temperature: " + ((response.main.temp - 273.15) * 9 / 5 + 32).toFixed(1) + "°F");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#wind-speed").text("Wind Speed: " + response.wind.speed + "MPH");
        var longitude = response.coord.lon;
        var latitude = response.coord.lat;


        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude,
            method: "GET"
        }).then(function (response) {

            $("#uv-index").text("UV Index: " + response.value);
            if (response.value <= 2) {
                $(".uv-severity").attr("style", "background-color: green")
            } else if (response.value <= 5) {
                $(".uv-severity").attr("style", "background-color: yellow")
            } else if (response.value <= 7) {
                $(".uv-severity").attr("style", "background-color: orange")
            } else if (response.value <= 10) {
                $(".uv-severity").attr("style", "background-color: red")
            } else {
                $(".uv-severity").attr("style", "background-color: black")
            }
        })
    });
}

function getForecast() {
    var j = 0;
    $(".card-body").empty();

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + place + "&appid=" + apiKey,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        while (j < 5) {
            console.log(response.list[j])
            $(".card-body[data-value=" + j + "]").append("<h6>" + moment().month() + "/" + moment().add(1 + j, "d").date() + "/" + moment().year() + "</h6>")
            $(".card-body[data-value=" + j + "]").append("<img src='http://openweathermap.org/img/wn/" + response.list[j].weather[0].icon + "@2x.png'>")
            $(".card-body[data-value=" + j + "]").append("<h6>Temp: " + ((response.list[j].main.temp - 273.15) * 9 / 5 + 32).toFixed(1) + "°F</h6>");
            $(".card-body[data-value=" + j + "]").append("<h6>Humidity: " + response.list[j].main.humidity + "%</h6>");
            console.log(moment().date());
            j++;
        }
    });
}

if (localStorage.getItem("cities") !== null) {
    buttonsReturned = localStorage.getItem("cities");
    buttons = JSON.parse(buttonsReturned);

    while (i < buttons.length) {
        $(".append-city").append("<button class='history'>" + buttons[i] + "</button> <br>")
        i++
    }
}

currentWeather();
getForecast();

$(".search").on("click", function () {
    placeInput = $(".search-input").val().trim();
    appendCityButton();
    getForecast();
    currentWeather();
});


$(".history").on("click", function () {

    placeInput = $(this).text();
    appendCityButton();
    setCityInfo();
    setFiveDay();
});