import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import React, { useState, useEffect, useMemo } from 'react';

import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import useWeatherAPI from './hooks/useWeatherAPI';

import { findLocation } from './utils/helpers';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = 'CWA-25F88BFF-F386-472E-843F-D39DEEA0E998'

const getMoment = (observationTime) => {
  const hour = new Date(observationTime).getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName } = currentLocation;
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY
  });

  const moment = useMemo(() => getMoment(weatherElement.observationTime), [weatherElement.observationTime]);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>

        {currentPage === 'WeatherCard' && (
          <WeatherCard 
            cityName={cityName}
            weatherElement={weatherElement} 
            moment={moment} 
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting setCurrentPage={setCurrentPage} setCurrentCity={setCurrentCity} storageCity={storageCity} />
        )}

      </Container>
    </ThemeProvider>
  );
}

export default App;
