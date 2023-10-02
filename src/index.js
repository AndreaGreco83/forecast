const locations = { "milan":{lat:"45.464203",long:"9.189982", name:"Milan", photo:"../assets/milan.jpg"},
                    "london":{lat:"51.507351",long:"-0.127758", name:"London", photo:"../assets/london.jpg"},
                    "bangkok":{lat:"13.756331",long:"100.501762", name:"Bangkok", photo:"../assets/bangkok.jpg"},
                    "los-angeles":{lat:"34.052235",long:"-118.243683", name:"Los Angeles", photo:"../assets/los_angeles.jpg"},
                    "tokyo":{lat:"35.689487",long:"139.691711", name:"Tokyo", photo:"../assets/tokyo.jpg"}};

const weatherConditions = { 0:"Clear sky",
                            1:"Partly cloudy",
                            2:"Partly cloudy",
                            3:"Partly cloudy",
                            45:"Fog",
                            48:"Fog",
                            51:"Drizzle",
                            53:"Drizzle",
                            55:"Drizzle",
                            56:"Freezing Drizzle",
                            57:"Freezing Drizzle",
                            61:"Rain",
                            63:"Rain",
                            65:"Rain",
                            66:"Freezing Rain",
                            67:"Freezing Rain",
                            71:"Snow fall",
                            73:"Snow fall",
                            75:"Snow fall",
                            77:"Snow grains",
                            80:"Rain showers",
                            81:"Rain showers",
                            82:"Rain showers",
                            85:"Snow showers",
                            86:"Snow showers",
                            95:"Thunderstorm",
                            96:"Heavy thunderstorm",
                            99:"Heavy thunderstorm"};

Object.keys(locations).forEach(key =>{
  callApi(key,locations[key]);
});

function callApi(key,location){
  let response;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&daily=weathercode&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FBerlin&forecast_days=14`);
  xhr.onload = function() {
    response = JSON.parse(xhr.response);
    populateSlider(response,key);
  };
  xhr.send();
}

function populateSlider (response,key) {
  console.log(response);
  const days = convertToForecastDays(response.daily);
  let slide= document.querySelector(`#${key}`);
  slide.querySelector(".forecast").innerHTML +=`${days[0].weatherCode}`;
  slide.querySelector(".temperature").innerHTML +=`${parseInt(response.current_weather.temperature)}`+"°";
  slide.querySelector(".min").innerHTML +=`${days[0].min}`;
  slide.querySelector(".max").innerHTML +=`${days[0].max}`;
  let dayElements =slide.querySelectorAll(".day");
  console.log(dayElements);
  dayElements.forEach( (element,index) =>{
    element.innerHTML += `${days[index].min}/${days[index].max}`;
  });
};

function convertToForecastDays (unformattedData) {
  let formattedData = [];
  for (i=0; i<unformattedData.time.length; i++){
    const day = {time:unformattedData.time[i],weatherCode:convertWeatherCodeToWeatherName(unformattedData.weathercode[i]),min:parseInt(unformattedData.temperature_2m_min[i]), max:parseInt(unformattedData.temperature_2m_max[i])};
    formattedData.push(day);
  }
  return formattedData;
}

function convertWeatherCodeToWeatherName (weatherCode){
  let weatherName="";
  weatherName = weatherConditions[weatherCode];
  return weatherName;
}

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const pagination = document.querySelector(".pagination");

  let currentIndex = 0;

  // Function to update the slider position
  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Function to update pagination bullets
  function updatePagination() {
    pagination.innerHTML = "";
    slides.forEach((_, index) => {
      const bullet = document.createElement("div");
      bullet.classList.add("pagination-button");
      if (index === currentIndex) {
        bullet.classList.add("active");
      }
      bullet.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
        updateArrowButtons();
        updatePagination();
      });
      pagination.appendChild(bullet);
    });
  }

  // Function to show or hide arrow buttons based on current slide
  function updateArrowButtons() {
    prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    nextButton.style.visibility = currentIndex === slides.length - 1 ? "hidden" : "visible";
  }

  // Event listener for the previous button
  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
      updateArrowButtons();
      updatePagination();
    }
  });

  // Event listener for the next button
  nextButton.addEventListener("click", function () {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlider();
      updateArrowButtons();
      updatePagination();
    }
  });

  // Swipe functionality for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].clientX;

    if (touchStartX - touchEndX > 50) {
      // Swipe left
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlider();
        updateArrowButtons();
        updatePagination();
      }
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
        updateArrowButtons();
        updatePagination();
      }
    }
  });

  // Initial setup
  updateArrowButtons();
  updatePagination();
});