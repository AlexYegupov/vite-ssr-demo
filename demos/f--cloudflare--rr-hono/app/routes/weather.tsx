import { useLoaderData, useSearchParams } from "react-router";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import styles from "./weather.module.css";
import { CitySelector } from "../components/city-selector";
import citiesData from "../../src/data/world-cities.json";

export function meta() {
  return [
    { title: "Weather Data" },
    { name: "description", content: "View weather information" },
  ];
}

interface WeatherData {
  generationtime_ms: number;
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
  };
}

interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population: number;
}

// Get the first 10 cities directly from world-cities.json

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const cityParam = url.searchParams.get("city");
  
  const cities = citiesData as City[];
  const defaultCity = cities[0];
  let latitude = defaultCity.latitude;
  let longitude = defaultCity.longitude;
  let cityName = `${defaultCity.name}, ${defaultCity.country}`;
  
  if (cityParam) {
    const [name, country] = cityParam.split(",");
    const city = [...cities.slice(0, 10)].find(
      c => c.name === name && c.country === country
    );
    if (city) {
      latitude = city.latitude;
      longitude = city.longitude;
      cityName = `${city.name}, ${city.country}`;
    }
  }

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
  );

  if (!response.ok) {
    throw new Response(`Weather API error: ${response.status}`, {
      status: response.status,
    });
  }

  const weatherData: WeatherData = await response.json();
  // Use first 10 cities from citiesData
  return { weatherData, cityName, cities: (citiesData as City[]).slice(0, 10) };
}

function getWeatherIcon(weatherCode: number, isDay: number): string {
  // Unicode weather icons based on WMO codes
  if (weatherCode === 0) {
    return isDay === 1 ? '☀️' : '🌙';
  } else if (weatherCode >= 1 && weatherCode <= 3) {
    return '☁️';
  } else if ((weatherCode >= 45 && weatherCode <= 48) || 
             (weatherCode >= 51 && weatherCode <= 67) ||
             (weatherCode >= 80 && weatherCode <= 82)) {
    return '🌧️';
  } else if ((weatherCode >= 71 && weatherCode <= 77) ||
             (weatherCode >= 85 && weatherCode <= 86)) {
    return '❄️';
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    return '⛈️';
  }
  
  return isDay === 1 ? '☀️' : '🌙';
}

function getWeatherDescription(weatherCode: number): string {
  const weatherDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return weatherDescriptions[weatherCode] || 'Unknown weather';
}

export default function WeatherPage() {
  const { weatherData, cityName, cities } = useLoaderData() as { 
    weatherData: WeatherData; 
    cityName: string; 
    cities: City[];
  };
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleCityChange = (cityValue: string) => {
    setSearchParams({ city: cityValue });
  };
  
  const weatherIcon = getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day);
  const weatherDescription = getWeatherDescription(weatherData.current.weather_code);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Link to="/">Back to Home</Link>
      </div>
      
      <h1>Weather Information</h1>
      
      <div className={styles.citySelectorContainer}>
        <CitySelector 
          value={cityName}
          onValueChange={handleCityChange}
          cities={cities}
        />
      </div>
      
      <div className={styles.weatherDisplay}>
        <div className={styles.location}>{cityName}</div>
        <div className={styles.weatherIcon}>{weatherIcon}</div>
        <div className={styles.temperature}>{weatherData.current.temperature_2m.toFixed(1)}°C</div>
        <div className={styles.weatherDescription}>{weatherDescription}</div>
        
        <div className={styles.weatherDetails}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Wind Speed</div>
            <div className={styles.detailValue}>{weatherData.current.wind_speed_10m.toFixed(1)} km/h</div>
          </div>
          
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Humidity</div>
            <div className={styles.detailValue}>{weatherData.hourly.relative_humidity_2m[0]}%</div>
          </div>
          
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Response Time</div>
            <div className={styles.detailValue}>{weatherData.generationtime_ms.toFixed(1)}ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
