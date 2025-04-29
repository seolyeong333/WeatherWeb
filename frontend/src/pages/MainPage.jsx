// ✅ src/pages/MainPage.jsx
import Header from "../components/Header";  // 헤더 컴포넌트 추가
import WeatherBox from "../components/WeatherBox"; 
import MapSection from "../components/MapSection";
import AirSection from "../components/AirSection";
import NationalWeatherFetcher from "../components/NationalWeatherFetcher";
import { useState } from "react"; // ✅ 이거 추가


function MainPage() {
  const [nationalWeatherData, setNationalWeatherData] = useState([]);
  const [isMorning, setIsMorning] = useState(true); // 🌟 추가
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      
      {/* 공통 헤더 */}
      <Header />
{/* 날씨 데이터 패치하기 (숨겨진 컴포넌트) */}
      <NationalWeatherFetcher setNationalWeatherData={setNationalWeatherData} />
      {/* 본문 */}
      <main style={{
        backgroundColor: "#E0E0E0",
        width: "100%",
        height: "calc(100vh - 60px)",  // 헤더 제외 높이
        overflowY: "auto",
        padding: "30px",
        boxSizing: "border-box",
      }}>
        
        {/* 지도 + 현재 날씨 */}
        <section style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
          
          {/* 현재 위치 */}
          <div style={{
            flex: 1,
            backgroundColor: "white",
            border: "1px solid #B0B0B0",
            borderRadius: "15px",
            padding: "20px",
            boxSizing: "border-box",
          }}>
            <WeatherBox />
          </div>

          {/* 전국 지도 */}
          <div style={{
            flex: 1,
            backgroundColor: "white",
            border: "1px solid #B0B0B0",
            borderRadius: "15px",
            padding: "20px",
            boxSizing: "border-box",
          }}>
            <MapSection weatherData={nationalWeatherData} />
          </div>

        </section>

        {/* 미세먼지 */}
        <section style={{
          backgroundColor: "white",
          border: "1px solid #B0B0B0",
          borderRadius: "15px",
          padding: "20px",
          boxSizing: "border-box",
        }}>
          <AirSection />
        </section>

      </main>
    </div>
  );
}

export default MainPage;
