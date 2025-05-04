import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
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
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
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
    </Routes>
  </BrowserRouter>
  )
}

export default App;
