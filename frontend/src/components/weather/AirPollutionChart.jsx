import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 명시적 import

function AirPollutionChart({ airPollutionData }) {
  if (!airPollutionData || !airPollutionData.list || airPollutionData.list.length === 0) {
    return <p>미세먼지 예보 정보가 없습니다.</p>;
  }

  const labels = airPollutionData.list.map((entry) => {
    const date = new Date(entry.dt * 1000);
    const day = `${date.getMonth() + 1}/${date.getDate()}`;
    const hour = `${date.getHours()}시`;
    return `${day} ${hour}`;
  });

  const pm25Values = airPollutionData.list.map((entry) => entry.components.pm2_5);
  const pm25Colors = pm25Values.map((v) => {
    if (v <= 15) return "#42A5F5"; // 좋음 (파랑)
    if (v <= 35) return "#66BB6A"; // 보통 (초록)
    if (v <= 75) return "#FFA726"; // 나쁨 (주황)
    return "#EF5350"; // 매우나쁨 (빨강)
  });

  const pm10Values = airPollutionData.list.map((entry) => entry.components.pm10);
  const pm10Colors = pm10Values.map((v) => {
    if (v <= 30) return "#42A5F5"; // 좋음 (파랑)
    if (v <= 80) return "#66BB6A"; // 보통 (초록)
    if (v <= 150) return "#FFA726"; // 나쁨 (주황)
    return "#EF5350"; // 매우나쁨 (빨강)
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
          callback: function (value, index) {
            return index % 4 === 0 ? this.getLabelForValue(value) : "";
          },
          maxRotation: 45,
          minRotation: 45,
          color: "#666",
        },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: "농도 (μg/m³)", color: "#666"},
        ticks: { color: "#666" },
        grid: { color: "#f0f0f0" }
      }
    },
  };

  return (
    <div className="air-section">
      <div className="chart-box">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}

export default AirPollutionChart;