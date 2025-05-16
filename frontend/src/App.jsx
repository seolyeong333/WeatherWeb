// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginSuccess from "./pages/LoginSuccess";
import MyPage from "./pages/MyPage";
import AdminPage from "./pages/AdminPage";
import TodayPlace from "./pages/TodayPlace";
import TodayTarot from "./pages/TodayTarot";
import { WeatherProvider } from "./components/WeatherContext";
import TodayLook from "./pages/TodayLook";
import TodayWeatherPage from "./pages/TodayWeatherPage";
import NoticePage from "./pages/NoticePage"; 
import SocialSignup from "./pages/SocialSignup";

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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/today-place/*" element={<TodayPlace />} />
          <Route path="/today-look" element={<TodayLook />} />
          <Route path="/horoscope/*" element={<TodayTarot />} />
          <Route path="/today-weather" element={<TodayWeatherPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/socialsignup" element={<SocialSignup />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
