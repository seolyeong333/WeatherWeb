// src/components/Login/Login.jsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import "./Login.css";

function Login({ closeLogin, setIsLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="loginModal">
      <div className="logo">
        <span style={{ color: "#333" }}>ON</span>
        <img src="/onda-favicon.png" alt="ONDA 로고" />
        <span style={{ color: "#333" }}>DA</span>
      </div>

      {isSignup ? (
        <SignupForm setIsSignup={setIsSignup} closeLogin={closeLogin} />
      ) : (
        <LoginForm setIsSignup={setIsSignup} closeLogin={closeLogin} setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default Login;
