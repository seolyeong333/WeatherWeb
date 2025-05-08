import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; 
import EmailAuth from './pages/emailauth'; 
import FindPasswd from './pages/findpasswd'; 
import ChangePasswd from './pages/changepasswd'; 
import DeleteUser from './pages/deleteuser'; 
import Info from './pages/info'; 
import NoticeForm from './pages/noticeform'; 
import NoticeDetail from './pages/noticedetail'; 
import NoticeList from './pages/noticelist'; 
import NoticeEdit from './pages/noticeedit';
import AIChat from './pages/aichat';
import MainPage from './pages/MainPage';
import MyPage from "./pages/MyPage";
import TodayPlace from "./pages/TodayPlace";
import { WeatherProvider } from "./components/WeatherContext"; // ✅

function App() {
  return (
<WeatherProvider> {/* ✅ 전체 앱을 감싸줌 */}
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/emailauth" element={<EmailAuth />} />
      <Route path="/findpasswd" element={<FindPasswd />} />
      <Route path="/changepasswd" element={<ChangePasswd />} />
      <Route path="/deleteuser" element={<DeleteUser />} />
      <Route path="/info" element={<Info />} />
      <Route path="/noticeform" element={<NoticeForm />} />
      <Route path="/notice/:id" element={<NoticeDetail />} />
      <Route path="/noticelist" element={<NoticeList />} />
      <Route path="/notice/edit/:id" element={<NoticeEdit />} />
      <Route path="/aichat" element={<AIChat />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/today-place" element={<TodayPlace />} />
    </Routes>
  </BrowserRouter>  
</WeatherProvider>
  );

}

export default App;
