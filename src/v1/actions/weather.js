import axios from 'axios';
import { WEATHER_DATA } from './types';

export const fetchWeather = () => async (dispatch) => {
  const city = 'Sydney';
  const openWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const openWeatherApiKey = 'cbb12c381d374cfac1c08adc6d504555';
  const weatherReq = await axios.get(
    `${openWeatherUrl}?q=${city}&APPID=${openWeatherApiKey}&units=metric`
  );
  const { data: payload } = weatherReq;
  dispatch({ type: WEATHER_DATA, payload });
};
