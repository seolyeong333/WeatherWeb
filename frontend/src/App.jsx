// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import TodayPlace from "./pages/TodayPlace";
import { WeatherProvider } from "./components/WeatherContext"; // ✅
import TodayLook from "./pages/TodayLook"; // ✅ 추가
import TodayTarot from "./pages/TodayTarot"; // ✅ 추가
import TodayWeatherPage from "./pages/TodayWeatherPage";
function App() {
  return (
    <WeatherProvider> {/* ✅ 전체 앱을 감싸줌 */}
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/today-place" element={<TodayPlace />} />
          <Route path="/today-look" element={<TodayLook />} /> {/* ✅ 코디 페이지 경로 */}
          <Route path="/today-tarot" element={<TodayTarot />} />
          <Route path="/today-weather" element={<TodayWeatherPage />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
