// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import KakaoLoginSuccess from "./pages/KakaoLoginSuccess";
import MyPage from "./pages/MyPage";
import TodayPlace from "./pages/TodayPlace";
import TodayPlaceList from "./components/TodayPlaceList"; 
import { WeatherProvider } from "./components/WeatherContext"; // ✅

function App() {
  return (
    <WeatherProvider> {/* ✅ 전체 앱을 감싸줌 */}
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/kakaologinsuccess" element={<KakaoLoginSuccess/>} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/today-place" element={<TodayPlace />} />
          <Route path="/today-place-list" element={<TodayPlaceList />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
