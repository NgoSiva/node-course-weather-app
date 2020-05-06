const weatherForm = document.querySelector("form")
const search = document.querySelector("input")
const messageOne = document.querySelector("#message")
const loader = document.querySelector(".lds-roller")
const weatherWidget = document.querySelector(".weather-widget")
const weatherWidgetContent = document.querySelector(".weather-widget__content")
const weatherWidgetLocation = document.querySelector(".weather-widget__location")
const weatherWidgetDescription = document.querySelector(".weather-widget__description")
const weatherWidgetIcon = document.querySelector(".weather-widget__icon img")
const weatherWidgetTemp = document.querySelector(".weather-widget__temp span")
const weatherWidgetTempMin = document.querySelector(".weather-widget__tmin span")
const weatherWidgetTempMax = document.querySelector(".weather-widget__tmax span")

const localData = sessionStorage.getItem("forecast")
const sessionDate = new Date(sessionStorage.getItem("date"))

const isToday = (date) => {
  const today = new Date()
  if (!!date) {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }
  return false
}


const getWeather = async (location) => {
  try {
    const response = await fetch("/weather?address=" + location)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

const renderWeather = (data) => {
  weatherWidget.classList.remove("loading")
  if (data.error) {
    weatherWidget.classList.remove("loading")
    messageOne.textContent = data.error
  } else {
    weatherWidget.classList.add("show-weather")
    const {
      location,
      forecast: {
        main: {
          feels_like,
          humidity,
          pressure,
          temp,
          temp_max,
          temp_min
        },
        weather: {
          main,
          icon
        },
        wind: {
          deg,
          speed
        }
      }
    } = data

    sessionStorage.setItem("forecast", JSON.stringify(data))
    sessionStorage.setItem('date', new Date().toJSON())
    weatherWidgetLocation.textContent = location
    weatherWidgetTemp.textContent = Math.round(temp)
    weatherWidgetDescription.textContent = main
    weatherWidgetTempMin.textContent = Math.round(temp_min)
    weatherWidgetTempMax.textContent = Math.round(temp_max)
    weatherWidgetIcon.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
  }
}

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
      messageOne.textContent = "Choose Location"
      console.log(e)
    })
}

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const location = search.value
  messageOne.textContent = ""
  weatherWidget.classList.remove("show-weather")
  weatherWidget.classList.add("loading")
  const data = await getWeather(location)
  renderWeather(data)
})
