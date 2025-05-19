import { useEffect, useState } from "react";
import { getForecast } from "../api/weather";  // 🌤️ OpenWeather 5일 예보 API
import { Card, Row, Col } from "react-bootstrap";
import { getKoreanWeatherDescforWeather } from "../utils/weatherUtil";  // 영어 설명 → 한국어 변환
import { toKST } from "../hooks/time"; // 한국 시간 변환 함수

/**
 * 주간 날씨 예보 컴포넌트
 * - 현재 위치 기반으로 5일 예보 데이터를 받아와
 * - 요일별로 정리 후 7개 카드로 출력
 */
function WeeklyForecast() {
  const [dailyWeather, setDailyWeather] = useState([]);  // 요일별 날씨 데이터

  // 컴포넌트 마운트 시 날씨 데이터 불러오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await getForecast(latitude, longitude);  // 5일 예보 (3시간 단위)

      const dailyMap = {};  // 날짜별 데이터를 그룹화하기 위한 객체

      // 각 데이터 항목을 날짜(yyyy-mm-dd)별로 묶기
      res.data.list.forEach((item) => {
        const kstDate = toKST(item.dt_txt); // 한국시간으로 변환
        const dateStr = kstDate.toISOString().split("T")[0]; // 날짜만 추출 (예: 2025-05-02)
        if (!dailyMap[dateStr]) dailyMap[dateStr] = [];
        dailyMap[dateStr].push({ ...item, dt_kst: kstDate });
      });

      // 요일별로 최소/최고기온, 날씨 아이콘, 설명 추출
      const daily = Object.entries(dailyMap)
        .slice(0, 7) // 최대 7일만 보여줌
        .map(([date, items]) => {
          const temps = items.map((i) => i.main.temp);
          const tempMin = Math.min(...temps).toFixed(1);
          const tempMax = Math.max(...temps).toFixed(1);
          const icon = items[0].weather[0].icon; // 대표 날씨 아이콘
          const rawDesc = items[0].weather[0].description;
          const description = getKoreanWeatherDescforWeather(rawDesc); // 자연스러운 한국어 설명

          return {
            date,  // yyyy-mm-dd
            day: toKST(date).toLocaleDateString("ko-KR", { weekday: "short" }), // 예: "금"
            tempMin,
            tempMax,
            icon,
            description,
          };
        });

      // 상태에 저장 → 화면 렌더링용
      setDailyWeather(daily);
    });
  }, []);

  return (
    <div className="mt-3">
      <h4 className="mb-3"> ㅤ  1주일 날씨 예보</h4>

      <Row className="g-3 justify-content-center">
  {dailyWeather.map((day, idx) => (
    <Col key={idx} xs={12} sm={6} md={4} lg={2} xl={2} className="d-flex justify-content-center">
      <Card className="text-center shadow-sm w-100" style={{ minWidth: "140px" }}>
        <Card.Body>
          <Card.Title style={{ fontSize: "14px" }}>{day.day}</Card.Title>
          <img
            src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt="날씨"
          />
          <div>{day.description}</div>
          <div>🌡 최고 {day.tempMax}°</div>
          <div>🌡 최저 {day.tempMin}°</div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

    </div>
  );
}

export default WeeklyForecast;
