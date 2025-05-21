import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 명시적 import

function DailyWeatherChart({ dailyData }) {
  if (!dailyData || dailyData.length === 0) return <p>주간 날씨 정보가 없습니다.</p>;

  const labels = dailyData.map((d) => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const maxTemps = dailyData.map((d) => d.temp_max);
  const minTemps = dailyData.map((d) => d.temp_min);
  const pops = dailyData.map((d) => d.pop);
  const humidities = dailyData.map((d) => d.humidity);

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
          font: { weight: "bold" },
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
          font: { weight: "bold" },
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
        title: { display: true, text: "기온 (°C)", color: "#FF9800" },
        ticks: { color: "#FF9800" },
        grid: { color: "#eee" },
      },
      y2: {
        type: "linear",
        position: "right",
        min: 0,
        max: 100,
        title: { display: true, text: "습도 / 강수확률 (%)", color: "#4CAF50" },
        ticks: { color: "#4CAF50", callback: (v) => `${v}%` },
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
      <div className="chart-box">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}

export default DailyWeatherChart;