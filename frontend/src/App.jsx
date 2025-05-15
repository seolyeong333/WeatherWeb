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
import NoticeList from "./pages/noticelist";
import NoticeDetail from "./pages/noticedetail";
import NoticeForm from "./pages/noticeform";
import NoticeEdit from "./pages/noticeedit";

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
          <Route path="/today-tarot" element={<TodayTarot />} />
          <Route path="/today-weather" element={<TodayWeatherPage />} />
          {/* 공지사항 관련 경로들 */}
          <Route path="/noticelist" element={<NoticeList />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/noticeform" element={<NoticeForm />} />
          <Route path="/notice/edit/:id" element={<NoticeEdit />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
