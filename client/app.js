import { getWeather, isToday, renderWeather, getPosition } from "./utils"

const weatherForm = document.querySelector("form")
const search = document.querySelector("input")
const message = document.querySelector("#message")
const weatherWidget = document.querySelector(".weather-widget")
const geolocationButton = document.querySelector(".button__geolocation")
const localData = sessionStorage.getItem("forecast")
const sessionDate = new Date(sessionStorage.getItem("date"))

if (localData && isToday(sessionDate)) {
  renderWeather(JSON.parse(localData))
} else {
  sessionStorage.clear()
  fetch("https://ipapi.co/json")
    .then((response) => {
      response.json().then((data) => {
        getWeather(data.city).then((data) => {
          sessionStorage.setItem("forecast", JSON.stringify(data))
          sessionStorage.setItem('date', new Date().toJSON())
          renderWeather(data)
        })
      })
    })
    .catch((e) => {
      weatherWidget.classList.remove("loading")
      message.textContent = "Choose Location"
      console.log(e)
    })
}

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const location = search.value
  message.textContent = ""
  weatherWidget.classList.remove("show-weather")
  weatherWidget.classList.add("loading")
  const data = await getWeather(location)
  renderWeather(data)
})

geolocationButton.addEventListener("click", async () => {
  message.textContent = ""
  weatherWidget.classList.remove("show-weather")
  weatherWidget.classList.add("loading")
  try {
    const { coords: { latitude, longitude } } = await getPosition();
    const data = await getWeather(longitude + "," + latitude)
    renderWeather(data)
  } catch (e) {
    weatherWidget.classList.remove("loading")
    message.textContent = e.message
  }
})
