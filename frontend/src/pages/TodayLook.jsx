import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./TodayLook.css";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
import { useNavigate } from "react-router-dom";
import ColorPickerModal from "../components/ColorPickerModal";
import { COLORS, fancyName, getTodayColor } from "../api/colors";
import view2col from "../assets/view-2col.png";
import view4col from "../assets/view-4col.png";

function TodayLook() {
  const navigate = useNavigate();
  const todayColor = getTodayColor(); // 오늘 날짜로 고정된 색상 하나 추출

  const [lookImages, setLookImages] = useState([]); // 받아온 코디 이미지 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [showModal, setShowModal] = useState(false); // 색상 선택 모달 표시 여부
  const [subColorCode, setSubColorCode] = useState(todayColor.hex); // 선택된 색상의 색상 코드
  const [selectedColorName, setSelectedColorName] = useState(todayColor.name); // 선택된 색상 이름
  const [gender, setGender] = useState("MEN"); // 필터: 성별
  const [type, setType] = useState("상의"); // 필터: 종류
  const [viewType, setViewType] = useState("grid-4"); // "grid-2" 또는 "grid-4" 설정


  // 필터 변경 시 이미지 크롤링 요청
  useEffect(() => {
    setLoading(true);
    const encodedColor = encodeURIComponent(selectedColorName);
    fetch(
      `http://localhost:8080/api/crawl/onthelook?color=${encodedColor}&gender=${gender}&type=${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLookImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("크롤링 실패:", err);
        setLoading(false);
      });
  }, [selectedColorName, gender, type]);

  return (
    <div className="today-look-wrapper">
      <Header />
      <section className="today-look-section">
        <div className="today-look-header">
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div className="color-box-wrapper">
              <div className="color-box" style={{ backgroundColor: todayColor.hex }} />
              <span className="color-label">오늘의 색</span>
            </div>
            <div className="color-box-wrapper">
              <div
                className="color-box"
                style={{ backgroundColor: subColorCode, boxShadow: "inset 0 0 0 1px #ccc" }}
              />
              <button className="color-select-btn" onClick={() => setShowModal(true)}>
                색상 선택
              </button>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {todayColor.name === selectedColorName
                  ? fancyName(todayColor.name)
                  : `${fancyName(todayColor.name)} & ${fancyName(selectedColorName)}`}
              </p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                봄날의 따사로운 햇살과 어울리는 오늘의 색상
              </p>
            </div>
          </div>

          <button className="tarot-btn" onClick={() => navigate("/today-tarot")}>
            타로 페이지에서 행운의 색 받기
          </button>
        </div>

        <hr style={{ margin: "1.5rem 0" }} />

        <h4 style={{ marginBottom: "1rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
          오늘의 색상의 추천 코디
        </h4>

        {/* 필터 + 뷰 토글 영역 전체 */}
        <div className="filter-and-toggle">
          {/* 성별/종류 필터 */}
          <div className="filter-group">
            <div>
              <button
                onClick={() => setGender("MEN")}
                className={gender === "MEN" ? "gender-btn-active" : "gender-btn-inactive"}
              >
                남
              </button>
              <button
                onClick={() => setGender("WOMEN")}
                className={gender === "WOMEN" ? "gender-btn-active" : "gender-btn-inactive"}
              >
                여
              </button>
            </div>
            <div>
              <button
                onClick={() => setType("상의")}
                className={type === "상의" ? "type-btn-active" : "type-btn-inactive"}
              >
                상의
              </button>
              <button
                onClick={() => setType("하의")}
                className={type === "하의" ? "type-btn-active" : "type-btn-inactive"}
              >
                하의
              </button>
            </div>
          </div>

          {/* 2열/4열 전환 아이콘 */}
          <div className="view-toggle">
            <button
              className={viewType === "grid-2" ? "view-active" : ""}
              onClick={() => setViewType("grid-2")}
            >
              <img src={view2col} alt="2열 보기" />
            </button>
            <button
              className={viewType === "grid-4" ? "view-active" : ""}
              onClick={() => setViewType("grid-4")}
            >
              <img src={view4col} alt="4열 보기" />
            </button>
          </div>
        </div>


        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ maxWidth: "200px", margin: "0 auto" }}>
              <Lottie animationData={loadingAnimation} loop={true} />
            </div>
            <p
              style={{
                marginTop: "1rem",
                color: "#555",
                fontFamily: "'Gowun Dodum', sans-serif",
                fontSize: "1.1rem",
              }}
            >
              오늘의 감성 코디를 불러오는 중입니다...
            </p>
          </div>
        ) : (
          <div className={`image-grid ${viewType}`}>
            {lookImages.map((src, i) => (
              <img key={i} src={src} alt={`look-${i}`} />
            ))}
          </div>
        )}
      </section>

      <ColorPickerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(color) => {
          setSubColorCode(color.hex);
          setSelectedColorName(color.name);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default TodayLook;
