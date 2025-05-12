import { useEffect, useState } from "react";
import { getCurrentWeather } from "../api/weather"; // OpenWeather API
import { getKoreanWeatherDescription } from "../api/weatherMapping"; // 영어 → 한글 변환

function WeatherMessageBox() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // 1️⃣ 현재 날씨 불러오기
        const weatherRes = await getCurrentWeather(latitude, longitude);
        const weather = weatherRes.data;

        const rawDesc = weather.weather[0].description;
        const weatherType = getKoreanWeatherDescription(rawDesc);
        const feelsLike = weather.main.feels_like;

        // 2️⃣ Spring 서버에 추천 메시지 요청
        const res = await fetch(
          `http://localhost:8080/api/weather/message?weatherType=${encodeURIComponent(
            weatherType
          )}&feelsLike=${feelsLike}`
        );

        if (!res.ok) throw new Error("메시지 요청 실패");

        const data = await res.json();
        console.log(data);
        setMessage(data.message); // DTO에서 message 필드 사용
      } catch (err) {
        console.error("메시지 가져오기 실패:", err);
        setMessage("추천 메시지를 불러오지 못했습니다.");
      }
    });
  }, []);

  return (
    <div
      className="weather-message-box"
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      <h3>오늘의 추천 메시지</h3>
      <p>{message ? message : "로딩 중..."}</p>
    </div>
  );
}

export default WeatherMessageBox;
