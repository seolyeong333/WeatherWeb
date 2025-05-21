import React from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 명시적 import

function HourlyWeatherChart({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) return <p>시간별 날씨 정보가 없습니다.</p>;

  const labels = hourlyData.map((h) => {
    const date = new Date(h.dt * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    return `${month}/${day} ${hour}시`;
  });

  const temps = hourlyData.map((h) => h.main?.temp || h.temp);
  const humidities = hourlyData.map((h) => h.main?.humidity ?? 50);
  const pops = hourlyData.map((h) => Math.round((h.pop ?? 0) * 100));

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
      datalabels: { display: false }, // 필요시 true로 변경하여 설정
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
      <div className="chart-box">
        <Line data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}

export default HourlyWeatherChart;