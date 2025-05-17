import { useState } from "react";
import EmailAuth from "./EmailAuth";
import ChangePassword from "./ChangePassword";

function FindPassword({ setMode }) {
  const [step, setStep] = useState("email");
  const [targetEmail, setTargetEmail] = useState("");

  return (
    <div>
      {step === "email" ? (
        <EmailAuth
          onSuccess={(email) => {
            setTargetEmail(email);
            setStep("change");
          }}
          onClose={() => setMode("login")}  // 🔁 로그인으로 돌아가기
        />
      ) : (
        <ChangePassword
          email={targetEmail}
          onClose={() => setMode("login")}  // 🔁 로그인으로 돌아가기
        />
      )}
    </div>
  );
}

export default FindPassword;
