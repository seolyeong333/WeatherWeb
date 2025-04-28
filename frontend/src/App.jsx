// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeatherPage from "./pages/WeatherPage"; // 우리가 만든 WeatherPage 가져오기
import MapPage from "./pages/MapPage";         // ✅ 새로 만든 MapPage 가져오기
import MainPage from "./pages/MainPage"; // ✨ 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<MainPage />} /> {/* 메인페이지 */}
        <Route path="/weather" element={<WeatherPage />} /> {/* 메인: 날씨 페이지 */}
        <Route path="/map" element={<MapPage />} />   {/* 지도: 카카오맵 페이지 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
