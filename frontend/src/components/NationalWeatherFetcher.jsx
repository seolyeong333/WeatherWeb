import { useEffect } from "react";

// 전국 주요 도시 목록 (lat/lon 포함)
// 실제 데이터는 생략되어 있지만 구조는 [{ name, lat, lon }]
const locations = [ /* 생략 */ ];

/**
 * 전국 날씨 데이터를 가져와서 부모 컴포넌트로 넘겨주는 역할
 * - 화면에는 아무것도 렌더링하지 않고 fetch만 담당하는 "데이터 전용 컴포넌트"
 */
const NationalWeatherFetcher = ({ setNationalWeatherData }) => {
  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "4f673522ff69c4d615b1e593ce6fa16b";

      // 모든 지역 날씨 데이터 요청을 병렬로 처리
      const promises = locations.map(async (loc) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric&lang=kr`;
        const response = await fetch(url);
        const data = await response.json();

        return {
          name: loc.name,
          temp: data.main.temp,
          temp_min: data.main.temp_min,  // ✅ 해당 지역의 최저기온
          temp_max: data.main.temp_max,  // ✅ 해당 지역의 최고기온
          weather: data.weather[0].main, // 예: Clear, Clouds 등
          lat: loc.lat,
          lon: loc.lon,
        };
      });

      // 모든 도시의 날씨 정보가 배열로 모여서 반환됨
      const results = await Promise.all(promises);

      // 콘솔에 결과 찍어보기 (개발 중 확인용)
      console.log("✅ 전국 날씨 데이터:", results); 

      // 부모 컴포넌트에 날씨 데이터 전달 (상태 업데이트)
      setNationalWeatherData(results);
    };

    fetchWeather();
  }, [setNationalWeatherData]); // 의존성: 부모에서 내려준 상태 변경 함수

  return null;  // ✅ 화면에는 아무것도 표시하지 않음 (데이터만 처리)
};

export default NationalWeatherFetcher;
