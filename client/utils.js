const geolocationButton = document.querySelector(".button__geolocation")
const searchButton = document.querySelector("button")
const weatherWidget = document.querySelector(".weather-widget")
const weatherWidgetLocation = document.querySelector(".weather-widget__location")
const weatherWidgetDescription = document.querySelector(".weather-widget__description")
const weatherWidgetIcon = document.querySelector(".weather-widget__icon img")
const weatherWidgetTemp = document.querySelector(".weather-widget__temp span")
const weatherWidgetTempMin = document.querySelector(".weather-widget__tmin span")
const weatherWidgetTempMax = document.querySelector(".weather-widget__tmax span")

export const getWeather = async (location) => {
  try {
    const response = await fetch("/weather?address=" + location)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

export const isToday = (date) => {
  const today = new Date()
  if (!!date) {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }
  return false
}

export const renderWeather = (data) => {
  weatherWidget.classList.remove("loading")
  geolocationButton.removeAttribute("disabled")
  searchButton.removeAttribute("disabled")
  if (data.error) {
    message.textContent = data.error
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

export const getPosition = (options) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}