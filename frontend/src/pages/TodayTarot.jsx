// src/pages/TodayTarot.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Tarot from "../components/Horoscope/Tarot";
import Shuffle from "../components/Horoscope/Shuffle";
import CardSelect from "../components/Horoscope/CardSelect";
import Result from "../components/Horoscope/Result";
import "./Background.css";

function TodayTarot() {
  const [step, setStep] = useState("intro");
  const [selectedCards, setSelectedCards] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  return (
    <div className="background-wrapper">
      <Header />
      <div className="common-background">
        <div className="common-container">
          {/* 콘텐츠 */}
          <main style={{ flex: 1, padding: "2rem" }}>
              {step === "intro" && (
                <Tarot onStart={(categoryId) => {
                setCategoryId(categoryId);
                setStep("shuffle");
              }}
            />
            )}
              {step === "shuffle" && <Shuffle onComplete={() => setStep("select")} />}
              {step === "select" && (
                <CardSelect 
                  categoryId={categoryId}
                  onFinish={(selected) => {
                    setSelectedCards(selected);
                    setStep("result");
                }}
              />
            )}
              {step === "result" && <Result 
                selectedCards={selectedCards}
                categoryId={categoryId} 
                onRestart={() => setStep("intro")} />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default TodayTarot;
