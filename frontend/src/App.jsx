import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import TarotCard from './pages/horoscope/TarotCard';
// import TarotFortune from './pages/horoscope/TarotFortun';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tarotcard" element={<TarotCard/>}/>
      </Routes>
  </BrowserRouter>
  );
}

export default App;
