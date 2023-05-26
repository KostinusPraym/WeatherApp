const form = document.getElementById("form");
const popup = document.getElementById("popup");
const root = document.querySelector(".root");
const loader = document.querySelector(".loader");
const input = document.getElementById("city");
const mainPropDate = document.querySelector(".main-prop__date");

let store = {
  city: localStorage.getItem("city") || "",
  weather: [],
  isDay: true,
};

const handleSubmit = (e) => {
  e.preventDefault();
  localStorage.setItem("city", store.city);

  input.value = "";
  popup.style.left = "-150px";

  new Promise((res, rej) => {
    setTimeout(() => {
      popup.style.display = "none";
      res();
    }, 60);
  }).then(() => {
    getInfo();
  });
};

async function getInfo() {
  try {
    loader.style.display = "block";
    const ACCESSKEY = "edcb89430d12e6ced3a57424c1adf2ee&units=metric";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${store.city}&appid=${ACCESSKEY}`);
    if (response.status >= 400) { throw new Error('Что то не так')}

    const data = await response.json();
    // const data = JSON.parse(
    //   '{"coord":{"lon":27.5667,"lat":53.9},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":12.86,"feels_like":11.19,"temp_min":12.86,"temp_max":12.86,"pressure":1031,"humidity":38,"sea_level":1031,"grnd_level":1005},"visibility":10000,"wind":{"speed":2.86,"deg":111,"gust":3.2},"clouds":{"all":2},"dt":1683623702,"sys":{"type":1,"id":8939,"country":"BY","sunrise":1683685017,"sunset":1683741324},"timezone":10800,"id":625144,"name":"Minsk","cod":200}'
    // );
    const {
      weather: weathers,
      main: { temp, humidity, pressure },
      visibility,
      wind: { speed: windSpeed },
      clouds: { all: clouds },
      name: city,
      sys: { sunrise, sunset },
    } = data;

    store = {
      ...store,
      weathers,
      humidity,
      pressure,
      temp,
      visibility,
      windSpeed,
      clouds,
      city,
      sunrise,
      sunset,
    };
    createModule(store);
    controlWeatherApp();
  } catch (e) {
    handleError(e);
  }
}

const createModule = ({
  weathers,
  temp,
  humidity,
  pressure,
  visibility,
  windSpeed,
  clouds,
  city,
  sunrise,
  sunset,
}) => {
  root.style.display = "flex";
  const { id, main } = weathers[0];
  temp = Math.round(temp);

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  root.innerHTML = `
        <div class="weather-app" id="weather-app">
            <div class="weather-app__header">
                <span class="weather-app__subtitle">Weather Today In</span>
                <button class="weather-app__btn-close" id="btn-close">X</button>
                <h1 class="weather-app__city">${city}</h1>
            </div>
            <div class="main-prop">
                <div class="main-prop__elem">
                    <img class="main-prop__image" src="./img/icons/${isDay(
                      id,
                      sunrise,
                      sunset
                    )}" alt="" />
                    <p>${main}</p>
                </div>
                <div class="main-prop__elem">
                    <span class="main-prop__temparature">${temp}C°</span>
                    <span class="main-prop__date">${new Date().toLocaleDateString(
                      "en-EN",
                      options
                    )}</span>
                </div>
            </div>
            <div class="weather-options">   
                ${renderOptions(
                  humidity,
                  pressure,
                  visibility,
                  windSpeed,
                  clouds
                )}
            </div>
        </div>
            `;
};

const renderOptions = (humidity, pressure, visibility, windSpeed, clouds) => {
  return `
  
        <div class="weather-options__element">
            <img src="/img/humidity.png" alt="" class="weather-options__img">
            <div>
                <p class="weather-options__values">${humidity} %</p>
                <p class="weather-options__describe">HUMIDITY</p>
            </div>
        </div>
   
    
        <div class="weather-options__element">
            <img src="./img/pressure.png" alt="" class="weather-options__img">
            <div>
                <p class="weather-options__values">${pressure} hPa</p>
                <p class="weather-options__describe">PRESSURE</p>
            </div>
        </div>
   
    
        <div class="weather-options__element">
            <img src="./img/visibility.png" alt="" class="weather-options__img">
            <div>
                <p class="weather-options__values">${visibility / 1000} km</p>
                <p class="weather-options__describe">VISIBILITY</p>
            </div>
        </div>
   
    
        <div class="weather-options__element">
            <img src="./img/wind.png" alt="" class="weather-options__img">
            <div>
                <p class="weather-options__values">${windSpeed} meter/sec</p>
                <p class="weather-options__describe">WIND SPEED</p>
            </div>
        </div>
  
    
        <div class="weather-options__element">
            <img src="./img/cloud.png" alt="" class="weather-options__img">
            <div>
                <p class="weather-options__values">${clouds} %</p>
                <p class="weather-options__describe">CLOUDS</p>
            </div>
        </div>
    `;
};

const isDay = (id, sunrise, sunset) => {
  const date = new Date();
  const currentDate = date.getTime();

  const sunsetUNIX = new Date(1000 * sunset).getTime();
  const sunriseUNIX = new Date(1000 * sunrise).getTime();

  if (currentDate >= sunriseUNIX && currentDate <= sunsetUNIX)
    store.isDay = true;
  else if (currentDate >= sunriseUNIX && currentDate > sunsetUNIX)
    store.isDay = false;
  else store.isDay = false;

  return getImage(id);
};

const getImage = (id) => {
  switch (store.isDay) {
    case true:
      switch (id) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
        case 201:
          return "day/11d@2x.png";
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
          return "day/09d@2x.png";
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 511:
        case 520:
        case 521:
        case 522:
        case 531:
          return "day/10d@2x.png";
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
          return "day/13d@2x.png";
        case 701:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 761:
        case 762:
        case 771:
        case 781:
          return "day/50d@2x.png";
        case 800:
          return "day/01d@2x.png";
        case 801:
          return "day/02d@2x.png";
        case 802:
          return "day/03d@2x.png";
        case 803:
          return "day/04d@2x.png";
        case 804:
          return "day/04d@2x.png";
        default:
          return "day/02d@2x.png";
      }
    case false:
      switch (id) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
        case 201:
          return "night/11n@2x.png";
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
          return "night/09n@2x.png";
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 511:
        case 520:
        case 521:
        case 522:
        case 531:
          return "night/10n@2x.png";
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
          return "night/13n@2x.png";
        case 701:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 761:
        case 762:
        case 771:
        case 781:
          return "night/50n@2x.png";
        case 800:
          return "night/01n@2x.png";
        case 801:
          return "night/02n@2x.png";
        case 802:
          return "night/03n@2x.png";
        case 803:
          return "night/04n@2x.png";
        case 804:
          return "night/04n@2x.png";
        default:
          return "night/02n@2x.png";
      }
  }
};

const controlWeatherApp = () => {
  const btnClose = document.getElementById("btn-close");
  const inputCity = document.querySelector(".weather-app__city");
  const app = document.querySelector(".weather-app");

  if (!store.isDay) app.classList.add("night");
  inputCity.addEventListener("click", handleClick);
  btnClose.addEventListener("click", handleClick);
};

const handleError = (error) => {
  root.style.display = "flex";
  root.innerHTML = `
        <div class="error-wrapper">
          <img src="./img/error.jpg" alt="">
          <p class="error-wrapper__message">${error.message}</p>
          <span class="error-wrapper__click" onclick="handleClick()">Попробуйте снова</span>
        </div>`;
};

const handleClick = () => {
  popup.style.display = "flex";
  setTimeout(() => (popup.style.left = "0px"), 60);
  root.style.display = "none";
  input.focus();
};

input.addEventListener("input", (e) => (store.city = e.target.value));

form.addEventListener("submit", handleSubmit);

if (!store.city) {
  root.style.display = "none";
  popup.style.display = "flex";
} else getInfo();
