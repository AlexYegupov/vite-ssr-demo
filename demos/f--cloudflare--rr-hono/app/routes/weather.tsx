import { useLoaderData } from "react-router";
import { Link } from "react-router";
import styles from "./todos.module.css";
import { Text } from "@radix-ui/themes";

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
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
  };
}

export async function loader() {
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FBerlin');
  
  if (!response.ok) {
    throw new Response(`Weather API error: ${response.status}`, { status: response.status });
  }
  
  const weatherData: WeatherData = await response.json();
  return { weatherData };
}

export default function WeatherPage() {
  const { weatherData } = useLoaderData() as { weatherData: WeatherData };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Link to="/">Back to Home</Link>
        <Link to="/todos" className={styles.weatherLink}>
          View Todos
        </Link>
      </div>
      <h1>Weather Information</h1>
      
      <div className={styles.weatherInfo}>
        <h3>Current Weather</h3>
        <Text as="p">Data generated in {weatherData.generationtime_ms.toFixed(2)}ms</Text>
        <Text as="p">
          Current temperature: {weatherData.current.temperature_2m.toFixed(2)}°C
        </Text>
        <Text as="p">
          Wind speed: {weatherData.current.wind_speed_10m.toFixed(2)} km/h
        </Text>
      </div>
    </div>
  );
}
