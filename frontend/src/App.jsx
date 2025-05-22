// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import CustomToastContainer from "./components/CustomToastContainer";
import { WeatherProvider } from "./components/WeatherContext";
import useAlarmSSE from "./hooks/useAlarmSSE";
import TodayWeatherPage from "./pages/TodayWeatherPage";
import TodayPlace from "./pages/TodayPlace";
import TodayTarot from "./pages/TodayTarot";
import TodayLook from "./pages/TodayLook";
import NoticePage from "./pages/NoticePage"; 
import MyPage from "./pages/MyPage";
import AdminPage from "./pages/AdminPage";
import SocialSignup from "./pages/SocialSignup";

function App() {
  const token = localStorage.getItem("token");

  useAlarmSSE(token, (msg) => {
    toast.info(msg);
  });

  return (
    <WeatherProvider>
      <CustomToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/today-place/*" element={<TodayPlace />} />
          <Route path="/today-look" element={<TodayLook />} />
          <Route path="/horoscope/*" element={<TodayTarot />} />
          <Route path="/" element={<TodayWeatherPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/socialsignup" element={<SocialSignup />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
