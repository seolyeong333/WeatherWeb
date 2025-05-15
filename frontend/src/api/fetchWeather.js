const API_KEY = "4f673522ff69c4d615b1e593ce6fa16b"; // OpenWeatherMap API 키

/**
 * 등급 판단 유틸
 */
function getPM10Grade(value) {
  if (value <= 30) return "좋음";
  if (value <= 80) return "보통";
  return "나쁨";
}

function getPM25Grade(value) {
  if (value <= 15) return "좋음";
  if (value <= 35) return "보통";
  return "나쁨";
}

/**
 * 실시간 날씨, 시간별 예보, 주간 예보, 미세먼지 데이터를 한 번에 불러오는 함수
 */
export async function fetchWeatherData(lat, lon) {
  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );
    const currentData = await currentRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );
    const forecastData = await forecastRes.json();

    const pollutionRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const pollutionData = await pollutionRes.json();

    const hourly = forecastData.list.slice(0, 8);

    const groupedByDate = {};
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(item);
    });

    const daily = Object.entries(groupedByDate)
      .slice(0, 5)
      .map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const weather = items[Math.floor(items.length / 2)]?.weather?.[0] || items[0].weather[0];
        const avgHumidity = Math.round(
          items.reduce((sum, i) => sum + (i.main.humidity || 0), 0) / items.length
        );
        const avgPop = Math.round(
          (items.reduce((sum, i) => sum + (i.pop || 0), 0) / items.length) * 100
        );

        return {
          date,
          temp_max: Math.max(...temps),
          temp_min: Math.min(...temps),
          weather,
          humidity: avgHumidity,
          pop: avgPop
        };
      });

    // 미세먼지 등급 포함
    const airData = pollutionData.list[0]; // 현재 시간대
    const pm10 = airData.components.pm10;
    const pm25 = airData.components.pm2_5;

    const pollution = {
      pm10,
      pm25,
      pm10Grade: getPM10Grade(pm10),
      pm25Grade: getPM25Grade(pm25)
    };

    return {
      current: currentData,
      hourly,
      daily,
      pollution
    };
  } catch (err) {
    console.error("🌩️ 날씨 API 호출 오류:", err);
    return null;
  }
}
