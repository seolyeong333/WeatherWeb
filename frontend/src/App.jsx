// ✅ src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage"; // ✨ 추가
import MyPage from "./pages/MyPage"; // ✅ import 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<MainPage />} /> {/* 메인페이지 */}
      <Route path="/mypage" element={<MyPage />} />   {/* ✅ 이 라인 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
