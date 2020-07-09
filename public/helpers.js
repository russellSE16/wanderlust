const createVenueHTML = (name, categories, location, iconSource) => {
    let venueHTML = `<h2>${name}</h2>
    <img class="venueimage" src="${iconSource}"/>
    <h4>${categories.name}</h4>
    <h3>Address:</h3>`
    location.formattedAddress.forEach(line => {
        venueHTML += `<p>${line}</p>`;
    })
    return venueHTML;
  }
  
  const createWeatherHTML = (currentDay) => {
    //console.log(currentDay)
    return `<h2>${weekDays[(new Date()).getDay()]}</h2>
          <h2>Temperature: ${kelvinToCelsius(currentDay.main.temp)}&deg;C</h2>
          <h2>Humidity: ${currentDay.main.humidity}%</h2>
          <h2>Condition: ${currentDay.weather[0].description}</h2>
        <img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png">`;
  }
  
  const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);
  const kelvinToCelsius = k => (k - 273.15).toFixed(0);