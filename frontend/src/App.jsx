// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import TodayPlace from "./pages/TodayPlace";
import { WeatherProvider } from "./components/WeatherContext"; // ✅

function App() {
  return (
    <WeatherProvider> {/* ✅ 전체 앱을 감싸줌 */}
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/today-place" element={<TodayPlace />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
