/* WEATHER SECTION */

const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const weatherDesc = document.querySelector("#weather-desc");
const forecastContainer = document.querySelector("#forecast-container");

/* Abuja Coordinates */
const weatherURL =
  "https://api.openweathermap.org/data/2.5/weather?lat=9.08&lon=7.53&units=metric&appid=d63c323e88ed73184e471fcf7dedf282";

const forecastURL =
  "https://api.openweathermap.org/data/2.5/forecast?lat=9.08&lon=7.53&units=metric&appid=d63c323e88ed73184e471fcf7dedf282";

/* CURRENT WEATHER */
async function getWeather() {
  try {
    const response = await fetch(weatherURL);

    if (!response.ok) throw Error("Weather fetch failed");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.log(error);
  }
}

function displayWeather(data) {
  currentTemp.textContent = `${Math.round(data.main.temp)}°C`;

  const iconCode = data.weather[0].icon;
  const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherIcon.setAttribute("src", iconURL);
  weatherIcon.setAttribute("alt", data.weather[0].description);

  weatherDesc.textContent = data.weather[0].description;
}

/* FORECAST */
async function getForecast() {
  try {
    const response = await fetch(forecastURL);

    if (!response.ok) throw Error("Forecast fetch failed");

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.log(error);
  }
}

function displayForecast(data) {
  forecastContainer.innerHTML = "";

  const filtered = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  filtered.slice(0, 3).forEach((day) => {
    const card = document.createElement("div");

    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    card.innerHTML = `
      <p><strong>${dayName}</strong></p>
      <p>${Math.round(day.main.temp)}°C</p>
    `;

    forecastContainer.appendChild(card);
  });
}

/* SPOTLIGHT MEMBERS */

const spotlightContainer = document.querySelector("#spotlight-container");
const membersURL = "data/members.json";

async function getMembers() {
  try {
    const response = await fetch(membersURL);

    if (!response.ok) throw Error("Members fetch failed");

    const data = await response.json();
    displaySpotlights(data.members);
  } catch (error) {
    console.log(error);
  }
}

function displaySpotlights(members) {
  const qualified = members.filter(
    (member) => member.membership === 2 || member.membership === 3
  );

  /* Shuffle members */
  const shuffled = [...qualified].sort(() => Math.random() - 0.5);

  /* Pick 3 members */
  const spotlights = shuffled.slice(0, 3);

  spotlightContainer.innerHTML = "";

  spotlights.forEach((member) => {
    const card = document.createElement("section");

    const level = member.membership === 3 ? "Gold Member" : "Silver Member";

    card.innerHTML = `
      <h3>${member.name}</h3>
      <p>${level}</p>
      <img src="images/${member.image}" alt="${member.name}">
      <p>${member.phone}</p>
      <p>${member.address}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
    `;

    spotlightContainer.appendChild(card);
  });
}

/* FOOTER */

const year = document.querySelector("#year");
const lastModified = document.querySelector("#lastModified");

if (year) year.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

/* RUN FUNCTIONS */

getWeather();
getForecast();
getMembers();


const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");
});