import React from 'react';

export const Weather = ({ weather }) => {
  if (!weather) return null;
  return (
    <p>
      The tempeture in {weather.name} is {weather.main.temp} degrees
    </p>
  );
};
