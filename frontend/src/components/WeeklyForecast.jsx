import { useEffect, useState } from "react";
import { getForecast } from "../api/weather";
import { Card, Row, Col } from "react-bootstrap";
import { getKoreanWeatherDescription } from "../api/weatherMapping";
import { toKST } from "../hooks/time"; // ✅ KST 변환 함수 import

function WeeklyForecast() {
  const [dailyWeather, setDailyWeather] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await getForecast(latitude, longitude);

      const dailyMap = {};
      res.data.list.forEach((item) => {
        const kstDate = toKST(item.dt_txt);
        const dateStr = kstDate.toISOString().split("T")[0];
        if (!dailyMap[dateStr]) dailyMap[dateStr] = [];
        dailyMap[dateStr].push({ ...item, dt_kst: kstDate });
      });

      const daily = Object.entries(dailyMap).slice(0, 7).map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const tempMin = Math.min(...temps).toFixed(1);
        const tempMax = Math.max(...temps).toFixed(1);
        const icon = items[0].weather[0].icon;
        const rawDesc = items[0].weather[0].description;
        const description = getKoreanWeatherDescription(rawDesc);

        return {
          date,
          day: toKST(date).toLocaleDateString("ko-KR", { weekday: "short" }),
          tempMin,
          tempMax,
          icon,
          description,
        };
      });

      setDailyWeather(daily);
    });
  }, []);

  return (
    <div className="mt-3">
      <h4 className="mb-3">🌈 1주일 날씨 예보</h4>

      <Row className="g-3">
        {dailyWeather.map((day, idx) => (
          <Col key={idx} xs={12} sm={6} md={4} lg={1} className="d-flex justify-content-center">
            <Card className="text-center shadow-sm w-100" style={{ minWidth: "120px" }}>
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
