window.addEventListener("load", function () {
  const weatherKey = "bab175a60595a67237967c71a23c4fab";
  let long;
  let lat;
  let Unit = "metric";
  let currentScale = "C";

  // DOM Elements
  let backgroundElement = document.querySelector("body");
  let mainSection = document.querySelector(".main-section");
  let disabledSection = document.querySelector(".disabled-geolocation");
  let locationTimezone = document.querySelector("#location-timezone");
  let temperatureDegree = document.querySelector("#temperature-degree");
  let temperatureFeelsLike = document.querySelector("#temperature-feels-like");
  let temperatureDesc = document.querySelector("#temperature-description");
  let temperatureUnit = document.querySelector("#unit");
  let refreshButton = document.querySelector("#refresh");
  let unitButton = document.querySelector("#degree-section");
  let lastUpdated = document.querySelector("#last-updated");

  // Getting users location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);

      long = position.coords.longitude;
      lat = position.coords.latitude;

      // Updating data
      function updateData() {
        // Fetching API
        let API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherKey}&units=${Unit}`;

        fetch(API)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);

            // Gathering date & time
            let date = new Date(Date.now());

            // Setting DOM Elements using API data
            locationTimezone.textContent = data.name;
            temperatureDegree.textContent = data.main.temp;
            temperatureUnit.textContent = currentScale;
            temperatureFeelsLike.textContent = `It feels like: ${data.main.feels_like} ${currentScale}`;
            temperatureDesc.textContent = data.weather[0].description;
            lastUpdated.textContent = "Last Updated: " + date;

            // Hiding disabled section
            mainSection.style.display = "flex";
            disabledSection.style.display = "none";

            // Setting background color based on time
            if (data.dt < data.sys.sunrise || data.dt > data.sys.sunset) {
              backgroundElement.style.background = `linear-gradient(rgb(5, 10, 34), rgb(18, 22, 103))`;
            } else {
              backgroundElement.style.background = `linear-gradient(rgb(47, 150, 163), rgb(48, 62, 143))`;
            }

            // Set Icon
            setIcons(data.weather[0], document.querySelector("#icon"));
          });
      }

      // Changes units on button click
      unitButton.addEventListener("click", function () {
        switch (Unit) {
          case "metric":
            Unit = "imperial";
            currentScale = "F";
            updateData();
            break;
          case "imperial":
            Unit = "metric";
            currentScale = "C";
            updateData();
            break;
        }
      });

      // Updates data on button click
      refreshButton.addEventListener("click", function () {
        updateData();
      });

      updateData();

      // Automatic update every 1 minute
      setInterval(updateData, 60 * 1000);
    });
  }

  // Sets weather icon
  function setIcons(weatherData, iconElement) {
    const skycons = new Skycons({ color: "white" });
    let icon;
    skycons.play();
    console.log();

    // Using API to set weather icon
    if (weatherData.icon.includes("01")) {
      if (weatherData.icon.includes("d")) {
        icon = "CLEAR_DAY";
      } else {
        icon = "CLEAR_NIGHT";
      }
    } else if (weatherData.icon.includes("02")) {
      if (weatherData.icon.includes("d")) {
        icon = "PARTLY_CLOUDY_DAY";
      } else {
        icon = "PARTLY_CLOUDY_NIGHT";
      }
    } else if (weatherData.icon.includes("03")) {
      icon = "CLOUDY";
    } else if (weatherData.icon.includes("04")) {
      icon = "CLOUDY";
    } else if (weatherData.icon.includes("09")) {
      icon = "RAIN";
    } else if (weatherData.icon.includes("10")) {
      icon = "RAIN";
    } else if (weatherData.icon.includes("11")) {
      icon = "CLOUDY";
    } else if (weatherData.icon.includes("13")) {
      icon = "SNOW";
    } else if (weatherData.icon.includes("50")) {
      icon = "FOG";
    }

    return skycons.set(iconElement, icon);
  }
});
