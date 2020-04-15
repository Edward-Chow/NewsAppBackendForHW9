import express from 'express';
import axios from 'axios';

const WEATHER_API = 'fb9031b305dbc795823e0e28cabf3761';
const router = express.Router();

function filterData(weatherInfo) {
  const retWeatherInfo = {};
  retWeatherInfo.weather = weatherInfo.weather[0].main;
  retWeatherInfo.temperature = weatherInfo.main.temp;
  return retWeatherInfo;
}

module.exports = () => {
  router.get('/:location', (req, res) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&units=metric&appid=${WEATHER_API}`
      )
      .then(response => {
        res.json(filterData(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  });
  return router;
};
