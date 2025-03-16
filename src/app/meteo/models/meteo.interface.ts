export interface Forecast {
    clouds: {
      all: number; //Cloudiness, %
    };
    dt: number; //timestamp
    dt_txt: string; //Time of data forecasted, ISO, UTC
    main: {
      feels_like: number; //This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
      temp: number; //Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
      grnd_level: number; //Atmospheric pressure on the ground level, hPa
      humidity: number; //Humidity, %
    };
    pop: number; //Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
    visibility: number; //Average visibility, metres. The maximum value of the visibility is 10km
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string; //https://openweathermap.org/img/wn/{weather.icon}@2x.png
    }>;
    wind: {
      speed: number; //Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
      deg: number; //Wind direction, degrees (meteorological)
    };
  }
  
  export interface City {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
  }