const API_KEY = "4f673522ff69c4d615b1e593ce6fa16b"; // OpenWeatherMap API 키

/**
 * 실시간 날씨, 시간별 예보, 주간 예보, 미세먼지 데이터를 한 번에 불러오는 함수
 * @param {number} lat - 위도
 * @param {number} lon - 경도
 * @returns {Promise<object|null>} 날씨 데이터 객체 또는 실패 시 null 반환
 */
export async function fetchWeatherData(lat, lon) {
  try {
    // 1. 현재 날씨 데이터 호출 (예: 온도, 날씨 상태, 습도 등)
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );
    const currentData = await currentRes.json();

    // 2. 5일간의 3시간 간격 예보 데이터 호출 (최대 40개 데이터 포함)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );
    const forecastData = await forecastRes.json();

    // 👉 여기서 pop 값들을 출력해서 확인
console.log("📊 pop 값 확인:", forecastData.list.map(i => i.pop));

    // 3. 미세먼지 데이터 호출 (현재 위치 기준 PM10, PM2.5, AQI 등)
    const pollutionRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const pollutionData = await pollutionRes.json();

    // 4. 시간별 예보: 3시간 간격 데이터 중 앞에서 8개만 추출 → 약 24시간 커버
    const hourly = forecastData.list.slice(0, 8);

    // 5. 날짜별로 그룹화하여 일자별 최고/최저기온 및 대표 날씨 추출
    const groupedByDate = {};
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD" 형식
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(item);
    });

    
    // 6. 각 날짜별로 최고기온/최저기온 계산, 대표 날씨 설정
    const daily = Object.entries(groupedByDate)
      .slice(0, 5) // 최대 5일치만 사용
      .map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const weather = items[Math.floor(items.length / 2)]?.weather?.[0] || items[0].weather[0];
        // ✅ 습도 평균 계산
        const avgHumidity = Math.round(
          items.reduce((sum, i) => sum + (i.main.humidity || 0), 0) / items.length
        );

        // ✅ 강수확률 평균 계산
        const avgPop = Math.round(
          (items.reduce((sum, i) => sum + (i.pop || 0), 0) / items.length) * 100
        );

        return {
          date,                      // 날짜 (예: 2025-05-13)
          temp_max: Math.max(...temps), // 최고 기온
          temp_min: Math.min(...temps), // 최저 기온
          weather,                   // 대표 날씨 객체 (main, description, icon 등)
          humidity: avgHumidity,    // ✅ 여기 추가
          pop: avgPop               // ✅ 여기도 추가
        };
      });

    // 7. 정리된 데이터 반환
    return {
      current: currentData,      // 현재 날씨 정보
      hourly,                    // 시간별 예보 (8개, 24시간)
      daily,                     // 일별 최고/최저/날씨 요약
      pollution: pollutionData.list, // 미세먼지 정보 리스트
    };
  } catch (err) {
    console.error("🌩️ 날씨 API 호출 오류:", err);
    return null;
  }
}
