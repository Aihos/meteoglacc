import { fetchWeatherApi } from 'openmeteo';
import Tun from './_component/Tun';
import Moon from './_component/Moon';
import ChartMeteo from './_component/chartMeteo';

const params = {
  "latitude": 48.2975,
  "longitude": -0.5583,
  "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);

const hourly = response.hourly()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	hourly: {
		time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
			(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
		relative_humidity_2m: hourly.variables(1)!.valuesArray(),
		wind_speed_10m: hourly.variables(2)!.valuesArray(),
    cloud_cover: hourly.variables(2)!.valuesArray(),
    uv_index_clear_sky_max: hourly.variables(0)!.valuesArray(),
	},
};


 const hour = new Date(weatherData.hourly.time[0]).getHours();

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
console.log("\nHourly data", weatherData.hourly);

export default function Page() {

  return(
    <div className='relative min-h-screen'>
      <h1>{Math.round(Number(weatherData.hourly.temperature_2m?.[0] ?? 0))}</h1>
      {/* mettre forme  */}
      <p>{weatherData.hourly.time[0]?.toString()}</p>
     

     

      {hour > 6 && hour < 20 ? <Tun/> : <Moon/>}

      <div className='min-h-[50vh] w-full absolute bottom-0 bg-white/10 backdrop-blur-sm border-1 z-2'>
 <p>{Math.round(Number(weatherData.hourly.wind_speed_10m?.[0]))}</p>
      <p>{Math.round(Number(weatherData.hourly.uv_index_clear_sky_max?.[0]))}</p>
      <p>{Math.round(Number(weatherData.hourly.relative_humidity_2m?.[0]))}</p>
      <div className='flex flex-col justify-center items-center'>
         <ChartMeteo data={weatherData} />
      </div>
     
      </div>
    </div>

  )
};