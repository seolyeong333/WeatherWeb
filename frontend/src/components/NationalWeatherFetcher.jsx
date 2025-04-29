import { useEffect } from "react";

const locations = [ /* 생략 */ ];

const NationalWeatherFetcher = ({ setNationalWeatherData }) => {  // 👈 props 받아야 해!

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "4f673522ff69c4d615b1e593ce6fa16b"; 

      const promises = locations.map(async (loc) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric&lang=kr`;
        const response = await fetch(url);
        const data = await response.json();
        return {
          name: loc.name,
          temp: data.main.temp,
          temp_min: data.main.temp_min, // ✅ 최저
          temp_max: data.main.temp_max, // ✅ 최고
          weather: data.weather[0].main,
          lat: loc.lat,
          lon: loc.lon,
        };
      });

      const results = await Promise.all(promises);
      console.log("✅ 전국 날씨 데이터:", results); 
      setNationalWeatherData(results); // ✅ 부모로 데이터 넘기기
    };

    fetchWeather();
  }, [setNationalWeatherData]); // setNationalWeatherData를 의존성에!

  return null; // 이제 화면에 안 띄우고 숨겨
};

export default NationalWeatherFetcher;
