const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            const data = {
                main: body.main,
                wind: body.wind,
                weather: body.weather[0]
            }
            callback(undefined, data)
        }
    })
}

module.exports = forecast