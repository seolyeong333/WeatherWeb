import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login'; 
import EmailAuth from './pages/emailauth'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/emailauth" element={<EmailAuth />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;
