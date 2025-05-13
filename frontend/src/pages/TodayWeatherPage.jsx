import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Line, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json"; // 경로는 프로젝트 구조에 맞게 조정
import { getKoreanWeatherDescription } from "../api/weatherMapping";


import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { fetchWeatherData } from "../api/fetchWeather";
import "./TodayWeatherPage.css";

// Chart.js 플러그인 등록
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ChartDataLabels);

function TodayWeatherPage() {
  const [weatherData, setWeatherData] = useState(null); // 전체 날씨 데이터
  const [coord, setCoord] = useState(null); // 위도/경도
  const [regionName, setRegionName] = useState(""); // 현재 위치 문자열
  const [airData, setAirData] = useState(null); // 공기질 데이터


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setCoord({ lat, lon });
      // 1. 날씨 데이터 호출 (fetchWeatherData에서 처리)
      // 2. 미세먼지 데이터 호출 (OpenWeather air_pollution API)
      // 3. 카카오 주소 변환 API 호출 → 시/구/동 표시

      // 날씨 정보 호출
      const data = await fetchWeatherData(lat, lon);
      // 실시간 날씨 → current
      // 5일 예보 (3시간 간격) → forecast
      // 미세먼지 → pollution
      // 이를 가공해 daily, hourly 형태로 구조화함
      setWeatherData(data);

      // 미세먼지 정보 호출
      try {
        const airRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=4f673522ff69c4d615b1e593ce6fa16b`
        );
        setAirData(airRes.data);
      } catch (err) {
        console.error("🌫️ 미세먼지 데이터 호출 실패:", err);
      }

      // 주소 변환
      try {
        const res = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
          {
            headers: {
              Authorization: "KakaoAK e7c76873999ef901948568fdbf33233b",
            },
          }
        );
        if (res.data.documents.length > 0) {
          const region = res.data.documents[0];
          setRegionName(
            `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`
          );
        }
      } catch (err) {
        console.error("📍 카카오 주소 변환 실패:", err);
      }
    });
  }, []);

 if (!weatherData) {
  return (
    <div className="loading-container">
      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150, height: 150 }} />
      <p>ONDA가 오늘의 하늘을 감지하는 중입니다…</p>
    </div>
  );
}

  const getWeatherEmoji = (icon) => {
  if (!icon) return "🌈";
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  if (icon.startsWith("50")) return "🌫️";
  return "🌈";
};

  
  const renderHeaderSection = () => {
  const temp = Math.round(weatherData.current.main.temp);
  const humidity = weatherData.current.main.humidity;
  const pop = Math.round((weatherData.hourly?.[0]?.pop || 0) * 100);
  const description = weatherData.current.weather[0].description;
  const icon = weatherData.current.weather[0].icon;
  const emoji = getWeatherEmoji(icon); // ☀️, 🌧️ 등

  return (
    <div className="header-section">
      <div className="header-overlay">
        
        <div>
        <h1 className="header-title">맑음이든 흐림이든, 오늘의 하늘은 당신 편이에요</h1>
        <br/>
        {regionName && (
          <p className="header-subtext">현재 위치: {regionName}</p>
        )}
        </div>
        
        <div className="header-summary-line">
          {emoji} {description}, {temp}°C / 습도 {humidity}% / 강수 확률 {pop}%
        </div>
      </div>
    </div>
  );
};

  const renderHourlyChart = () => {
    const hourly = weatherData.hourly;

    const labels = hourly.map((h) => {
      const date = new Date(h.dt * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      return `${month}/${day} ${hour}시`;
    });

    const temps = hourly.map((h) => h.main?.temp || h.temp);
    const humidities = hourly.map((h) => h.main?.humidity ?? 50); // ✅ 시간별 습도
    const pops = hourly.map((h) => Math.round((h.pop ?? 0) * 100)); // ✅ 시간별 강수 확률 (%)

    const data = {
      labels,
      datasets: [
        {
          label: "기온 (°C)",
          data: temps,
          borderColor: "#FFD166",
          backgroundColor: "rgba(255, 209, 102, 0.3)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          yAxisID: "y",
        },
        {
          label: "습도 (%)",
          data: humidities,
          borderColor: "#64B5F6",
          backgroundColor: "rgba(100, 181, 246, 0.2)",
          tension: 0.4,
          fill: false,
          borderDash: [5, 5],
          pointRadius: 3,
          yAxisID: "y1",
        },
        {
          label: "강수 확률 (%)",
          data: pops,
          borderColor: "#9E9E9E",
          backgroundColor: "rgba(158,158,158,0.2)",
          borderDash: [3, 3],
          tension: 0.4,
          fill: false,
          pointStyle: "rect",
          pointRadius: 3,
          yAxisID: "y1",
        },
      ],
    };

    const options = {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { position: "top", labels: { color: "#333" } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const label = ctx.dataset.label;
              return `${label}: ${ctx.raw}${label.includes("°C") ? "°C" : "%"}`;
            },
          },
        },
        datalabels: { display: false },
      },
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "기온 (°C)", color: "#FFD166" },
          ticks: { color: "#FFD166" },
          grid: { color: "#f0f0f0" },
        },
        y1: {
          type: "linear",
          position: "right",
          title: { display: true, text: "습도 / 강수확률 (%)", color: "#666" },
          ticks: { color: "#666" },
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
        },
        x: {
          ticks: { color: "#666" },
          grid: { display: false },
        },
      },
    };

    return (
      <div className="hourly-section">
        <h2 className="chart-title">시간별 날씨</h2>
        <div className="chart-box">
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    );
  };

const renderDailyChart = () => {
  const labels = weatherData.daily.map((d) => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const maxTemps = weatherData.daily.map((d) => d.temp_max);
  const minTemps = weatherData.daily.map((d) => d.temp_min);
  const pops = weatherData.daily.map((d) => d.pop);
  const humidities = weatherData.daily.map((d) => d.humidity);

  const data = {
    labels,
    datasets: [
      {
        label: "최고 기온",
        data: maxTemps,
        backgroundColor: "#FFB74D",
        yAxisID: "y1",
        datalabels: {
          color: "#FF9800",
          anchor: "end",
          align: "start",
          font: {
            weight: "bold",
          },
          formatter: (value) => `${value.toFixed(1)}°C`,
        },
      },
      {
        label: "최저 기온",
        data: minTemps,
        backgroundColor: "#64B5F6",
        yAxisID: "y1",
        datalabels: {
          color: "#1976D2",
          anchor: "end",
          align: "start",
          font: {
            weight: "bold",
          },
          formatter: (value) => `${value.toFixed(1)}°C`,
        },
      },
      {
        type: "line",
        label: "강수 확률 (%)",
        data: pops,
        borderColor: "#9E9E9E",
        borderDash: [5, 5],
        backgroundColor: "#9E9E9E",
        fill: false,
        yAxisID: "y2",
        tension: 0.3,
        pointRadius: 3,
      },
      {
        type: "line",
        label: "습도 (%)",
        data: humidities,
        borderColor: "#4CAF50",
        backgroundColor: "#A5D6A7",
        fill: false,
        yAxisID: "y2",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.label.includes("기온")) return `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}°C`;
            return `${ctx.dataset.label}: ${ctx.raw}%`;
          },
        },
      },
      datalabels: {
        display: (context) => context.dataset.type !== "line", // 막대에만 표시
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "기온 (°C)",
          color: "#FF9800",
        },
        ticks: { color: "#FF9800" },
        grid: { color: "#eee" },
      },
      y2: {
        type: "linear",
        position: "right",
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "습도 / 강수확률 (%)",
          color: "#4CAF50",
        },
        ticks: {
          color: "#4CAF50",
          callback: (v) => `${v}%`,
        },
        grid: { drawOnChartArea: false },
      },
      x: {
        ticks: { color: "#666" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="daily-section">
      <h2 className="chart-title">주간 날씨</h2>
      <div className="chart-box">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};




  const renderAirPollutionChart = () => {
  if (!airData) return null;

  const labels = airData.list.map((entry) => {
    const date = new Date(entry.dt * 1000);
    const day = `${date.getMonth() + 1}/${date.getDate()}`;
    const hour = `${date.getHours()}시`;
    return `${day} ${hour}`; // 결과 예: "5/13 15시"
  });


  // ✅ PM2.5 색상 분기
  const pm25Values = airData.list.map((entry) => entry.components.pm2_5);
  const pm25Colors = pm25Values.map((v) => {
    if (v <= 15) return "#42A5F5"; // 파랑
    if (v <= 35) return "#66BB6A"; // 초록
    if (v <= 75) return "#FFA726"; // 주황
    return "#EF5350"; // 빨강
  });

  // ✅ PM10 색상 분기
  const pm10Values = airData.list.map((entry) => entry.components.pm10);
  const pm10Colors = pm10Values.map((v) => {
    if (v <= 30) return "#42A5F5"; // 파랑
    if (v <= 80) return "#66BB6A"; // 초록
    if (v <= 150) return "#FFA726"; // 주황
    return "#EF5350"; // 빨강
  });

  const data = {
    labels,
    datasets: [
      {
        label: "PM2.5 (μg/m³)",
        data: pm25Values,
        backgroundColor: pm25Colors,
        borderRadius: 4,
      },
      {
        label: "PM10 (μg/m³)",
        data: pm10Values,
        backgroundColor: pm10Colors,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333", font: { size: 13, weight: "bold" } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} μg/m³`,
        },
      },
      datalabels: {
        display: true,
        color: "#444",
        anchor: "end",
        align: "start",
        font: { size: 11 },
        formatter: (v) => `${Math.round(v)}`,
      },
    },
    scales: {
    x: {
      ticks: {
        // 4시간마다만 출력 (데이터가 많을 경우)
        callback: function (value, index) {
          return index % 4 === 0 ? this.getLabelForValue(value) : "";
        },
        maxRotation: 45,   // 글자 기울이기
        minRotation: 45,
        color: "#666",
      },
    },
  },
  };

  return (
    <div className="air-section">
      <h2 className="chart-title">미세먼지 예보 (PM2.5 / PM10)</h2>
      <div className="chart-box">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};



  const renderDetailSection = () => {
  const today = weatherData.daily[0];

  const rawDesc = today.weather.description;
  const desc = getKoreanWeatherDescription(rawDesc);  // ✅ 한국어 표현으로 변환

  const max = Math.round(today.temp_max);
  const min = Math.round(today.temp_min);

  const getTip = (desc, max) => {
    if (desc.includes("비")) return "☔ 우산을 챙기세요!";
    if (desc.includes("맑음") && max > 25) return "🌞 자외선 차단제를 준비하세요!";
    if (max < 10) return "🧥 외투를 준비하세요!";
    return "🌿 산책하기 좋은 날씨입니다.";
  };

  return (
    <div className="detail-section">
      <h2 className="detail-title">오늘의 날씨 요약</h2>
      <div className="summary-box">
        <p>오늘은 <strong>{desc}</strong>이며, 기온은 <strong>{min}°C ~ {max}°C</strong>입니다.</p>
      </div>
      <div className="recommendation-box">
        <h3>오늘의 추천</h3>
        <p>{getTip(desc, max)}</p>
      </div>
    </div>
  );
};


  return (
    <div className="today-weather-page">
      <Header />
      {renderHeaderSection()}
      {renderHourlyChart()}
      {renderDailyChart()}
      {renderAirPollutionChart()}
      {renderDetailSection()}
    </div>
  );
}

export default TodayWeatherPage;
