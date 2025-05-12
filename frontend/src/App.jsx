// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginSuccess from "./pages/LoginSuccess";
import MyPage from "./pages/MyPage";
import TodayPlace from "./pages/TodayPlace";
import TodayTarot from "./pages/TodayTarot";
import { WeatherProvider } from "./components/WeatherContext"; // ✅

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
          <Route path="/today-tarot" element={<TodayTarot />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
