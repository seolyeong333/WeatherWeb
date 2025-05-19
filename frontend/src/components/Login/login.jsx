// src/components/Login/login.jsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import FindPassword from "./FindPassword";
import ChangePassword from "./ChangePassword";
import "./login.css";

function Login({ closeLogin, setIsLoggedIn }) {
  const [mode, setMode] = useState("login"); 
  const [emailForReset, setEmailForReset] = useState("");

  return (
    <div className="loginModal">
      <div className="logo">
        <span style={{ color: "#333" }}>ON</span>
        <img src="/onda-favicon.png" alt="ONDA 로고" />
        <span style={{ color: "#333" }}>DA</span>
      </div>

      {mode === "login" && (
        <LoginForm
          setIsLoggedIn={setIsLoggedIn}
          closeLogin={closeLogin}
          setMode={setMode}
        />
      )}

      {mode === "signup" && (
        <SignupForm
          closeLogin={closeLogin}
          setMode={setMode}
        />
      )}

      {mode === "findPassword" && (
        <FindPassword
          setMode={setMode}
          onSuccess={(email) => {
            setEmailForReset(email);
            setMode("changePassword");
          }}
          onClose={() => setMode("login")}
        />
      )}

      {mode === "changePassword" && (
        <ChangePassword
          email={emailForReset}
          onClose={() => setMode("login")}
        />
      )}

    {mode === "socialSignup" && (
      <>
        <div className="modalOverlay" onClick={onClose}></div>
        <SocialSignup
          email={email}
          nickname={nickname}
          provider={provider}
          onClose={closeModal}
        />
      </>
    )}




    </div>
  );
}

export default Login;
