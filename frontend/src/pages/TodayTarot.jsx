// src/pages/TodayTarot.jsx
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Tarot from "../components/Horoscope/Tarot";
import Shuffle from "../components/Horoscope/Shuffle";
import CardSelect from "../components/Horoscope/CardSelect";
import Result from "../components/Horoscope/Result";
import "../styles/Background.css";

function TodayTarot() {
  const [step, setStep] = useState("intro");
  const [selected, setSelected] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [isEntering, setIsEntering] = useState(false);

   useEffect(() => {
    if (isEntering) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEntering]);

  return (
    <div className="background-wrapper">
      {isEntering && <div className="tarot-entering-overlay" />}
      <Header />
      <div className="common-background">
        <div className={`common-container ${isEntering ? "expanding" : ""}`}>
          {/* 콘텐츠 */}
          <main style={{ flex: 1, padding: "2rem" }}>
              {step === "intro" && (
                <Tarot onStart={(categoryId) => {
                setCategoryId(categoryId);
                setIsEntering(true);

                setTimeout(() => {
                    setStep("shuffle");
                  }, 1000);
              }}
              onShufflingStart={() => setIsEntering(true)}
            />
            )}
              {step === "shuffle" && <Shuffle onComplete={() => setStep("select")} />}
              {step === "select" && (
                <CardSelect 
                  categoryId={categoryId}
                  onFinish={(selected) => {
                    setSelected(selected);
                    setIsEntering(false);
                    setStep("result");
                }}
              />
            )}
              {step === "result" && <Result 
                selected={selected}
                categoryId={categoryId} /> }
          </main>
        </div>
      </div>
    </div>
  );
}

export default TodayTarot;
