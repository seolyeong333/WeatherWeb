// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginSuccess from "./pages/LoginSuccess";
import MyPage from "./pages/MyPage";
import TodayPlace from "./pages/TodayPlace";
import TodayTarot from "./pages/TodayTarot";
import { WeatherProvider } from "./components/WeatherContext";
import TodayLook from "./pages/TodayLook";
import TodayWeatherPage from "./pages/TodayWeatherPage";

function App() {
  return (
    <WeatherProvider> {/* ✅ 전체 앱을 감싸줌 */}
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/kakaologinsuccess" element={<LoginSuccess/>} />
          <Route path="/googleloginsuccess" element={<LoginSuccess/>} />
          <Route path="/naverloginsuccess" element={<LoginSuccess/>} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/today-place/*" element={<TodayPlace />} />
          <Route path="/today-look" element={<TodayLook />} />
          <Route path="/today-tarot" element={<TodayTarot />} />
          <Route path="/today-weather" element={<TodayWeatherPage />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
