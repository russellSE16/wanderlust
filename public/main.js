// Foursquare API Info
const clientId = 'LCEU2PV2UOROER5Q20MAKHMALUZB5MBWGSI40FUQ4ZIPUQCI';
const clientSecret = 'YSIUX330XWXFM3NS5FTVUKNZVHYASUET0A0IHWGIOLECDTPE';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const venueUrl = 'https://api.foursquare.com/v2/venues/';

// OpenWeather Info
const openWeatherKey = '4a566f0459afa27cfcdd59d6cd0711c2';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const limit = '10';
  const urlToFetch = `${url}${city}&limit=${limit}&client_id=${clientId}&client_secret=${clientSecret}&v=20200612`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(property => property.venue);
      console.log(venues);
      return venues;
    }
  }
  catch(error) {
    console.log(error);
  }
};

const getVenueImage = async (venue) => {
    const urlToFetch = `${venueUrl}${venue.id}/photos?limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200612`;
    try {
        const response = await fetch(urlToFetch);
        if(response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.response.photos;
        }
    }
    catch(error) {
        console.log(error);
    } 
};

const getForecast = async () => {
  const city = $input.val();
  const urlToFetch = `${weatherUrl}?q=${city}&APPID=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      //console.log(jsonResponse);
      return jsonResponse;
    }
  }
  catch(error) {
    console.log(error);
  }
}


// Venue selection functions
const selectVenues = (venues) => {
    const selected = [];
    const selectedVenues = [];
    for(let i = 0; i < 4; i++) {
        let randomIndex;
        let addToDiv = false;
        do {
            randomIndex = Math.floor(Math.random() * 10);
            if (!selected.includes(randomIndex)) {
                selected.push(randomIndex);
                selectedVenues.push(venues[randomIndex]);
                addToDiv = true;
            }
        } while (addToDiv === false);
    }
    return selectedVenues;
}

const getSelectedVenueImages = (venues) => {
    const venueImages = venues.map(async venue => {
        const venuePhotos = await getVenueImage(venue);
        const selectedImage = selectImage(venuePhotos);
        return selectedImage;
    });
    return Promise.all(venueImages).then(resolve => resolve);
}

const selectImage = venuePhotos => {
    console.log(venuePhotos);
    const numPhotos = venuePhotos.count;
    const randomIndex = Math.floor(Math.random() * numPhotos);
    return venuePhotos.items[randomIndex];
}

// Render functions
const renderVenues = (venues) => {
    $venueDivs.forEach(($venue, index) => {
    // Add your code here:
        const venue = venues[index];
        const venueIcon = venue.categories[0].icon;
        const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
        let venueContent = createVenueHTML(venue.name, venue.categories[0], venue.location, venueImgSrc);
        $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
  return venues;
}

const renderVenueImages = venueImages => {
    $venueDivs.forEach(($venue, index) => {
        let venueImageContent = `<img class="venueimage" src="${venueImages[index].prefix}300x300${venueImages[index].suffix}"/>`;
        $venue.append(venueImageContent);
    })
}

const renderForecast = (day) => {
  // Add your code here:
  let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues()
  .then(venues => selectVenues(venues))
  .then(venues => renderVenues(venues))
  .then(venues => getSelectedVenueImages(venues))
//   .then(venues => [{
//     prefix: 'https://fastly.4sqi.net/img/general/',
//     suffix: '/32659214_L6RMm1-KwfSfaliRcGYnWhqSEI7qrezs5nWs7WdU9yM.jpg'
//     },{
//     prefix: 'https://fastly.4sqi.net/img/general/',
//     suffix: '/32659214_L6RMm1-KwfSfaliRcGYnWhqSEI7qrezs5nWs7WdU9yM.jpg'
//     },{
//     prefix: 'https://fastly.4sqi.net/img/general/',
//     suffix: '/14007097_Z2jmiA1LmBUvLMAvFe85R1zVcxT0e8iKDR_3OKETshI.jpg'
//     },{
//     prefix: 'https://fastly.4sqi.net/img/general/',
//     suffix: '/3533395_XIjQaHaL6eB9TI5Hr20u_Uwn6wSEIcSXczLWAWMHBpQ.jpg'
//     }
//     ])
  .then(venueImages => renderVenueImages(venueImages));  
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)