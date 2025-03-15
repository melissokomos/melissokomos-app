import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, CloudRain, Sun, Wind, CloudSnow, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: React.ReactNode;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeatherIcon = (condition: string) => {
    condition = condition.toLowerCase();
    if (condition.includes("clear") || condition.includes("sunny")) {
      return <Sun className="h-8 w-8 text-amber-400" />;
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-400" />;
    } else if (condition.includes("cloud")) {
      return <Cloud className="h-8 w-8 text-gray-400" />;
    } else if (condition.includes("snow")) {
      return <CloudSnow className="h-8 w-8 text-gray-200" />;
    } else if (condition.includes("wind")) {
      return <Wind className="h-8 w-8 text-blue-300" />;
    } else {
      return <Sun className="h-8 w-8 text-amber-400" />; // default
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      // Using OpenWeatherMap API
      const apiKey = "ea780576e69045089b2dffb6ac2b21b5"; // Free API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: getWeatherIcon(data.weather[0].main),
      };

      setWeather(weatherData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching weather:", err);
      setError("Could not retrieve weather data");
      setLoading(false);
      toast.error("Failed to fetch weather data");
    }
  };

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Could not retrieve your location");
          setLoading(false);
          toast.error("Failed to get your location. Please allow location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      toast.error("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Local Weather</CardTitle>
        <CardDescription>
          {weather?.location ? (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{weather.location}</span>
            </div>
          ) : (
            "Weather information"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={getLocation} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : weather ? (
          <div className="flex items-center">
            <div className="mr-4">{weather.icon}</div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{weather.temperature}°C</span>
                <span className="text-muted-foreground">{weather.condition}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Wind:</span>
                  <span>{weather.windSpeed} m/s</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
