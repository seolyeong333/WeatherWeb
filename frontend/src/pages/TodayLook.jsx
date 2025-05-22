import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import FashionIconSection from "../components/TodayLook/FashionIconSection";
import ColorPickerModal from "../components/ColorPickerModal";
import Header from "../components/Header";
import loadingAnimation from "../assets/loading.json";
import { getKoreanWeatherDescription } from "../utils/weatherUtil";
import { getSeasonalMessage } from "../utils/getSeasonalMsg";
import { getUserGender } from "../api/jwt";
import { fancyName, getLuckyColor, getTodayColor } from "../api/colors";
import { fetchTodayTarotLogs } from "../api/tarot";
import { getCurrentWeather } from "../api/weather";
import view2col from "../assets/view-2col.png";
import view4col from "../assets/view-4col.png";
import "../styles/TodayLook.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TodayLook() {
  const navigate = useNavigate();
  const location = useLocation();

  const [current, setCurrent] = useState(null);
  const [lookImages, setLookImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("grid-4");
  const { userColorName } = location.state || {};
  const todayColor = getLuckyColor(userColorName) || getTodayColor();
  const [showModal, setShowModal] = useState(false);
  const [subColorCode, setSubColorCode] = useState(todayColor.hex);
  const [selectedColorName, setSelectedColorName] = useState(todayColor.name);
  const [gender, setGender] = useState(null);
  const [type, setType] = useState("상의");
  const [showIcons, setShowIcons] = useState({});
  const [hasResult, setHasResult] = useState(false);

  const normalizeWeatherType = (rawType) => {
    if (["맑음"].includes(rawType)) return "맑음";
    if (["눈"].includes(rawType)) return "눈";
    if (["소나기", "이슬비", "뇌우", "비"].includes(rawType)) return "비";
    if (["구름 많음", "흐림"].includes(rawType)) return "흐림";
    if (["기타"].includes(rawType)) return "기타";
    return rawType;
  };

  useEffect(() => {
    const loadGender = async () => {
      try {
        const userGender = await getUserGender();
        console.log("불러온 성별:", userGender);
        if (userGender === "male") setGender("MEN");
        else if (userGender === "female") setGender("WOMEN");
        else setGender("MEN");
      } catch (err) {
        console.error("성별 정보 로딩 실패:", err);
        setGender("WOMEN");
      }
    };
    loadGender();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await getCurrentWeather(latitude, longitude);
        setCurrent(res.data);

        const rawDesc = res.data.weather[0].description;
        const desc = getKoreanWeatherDescription(rawDesc);
        const weatherType = normalizeWeatherType(desc);
        const feelsLike = res.data.main.feels_like;

        const response = await fetch(
          `${API_BASE_URL}/api/weather/recommend?weatherType=${weatherType}&feelsLike=${feelsLike}`
        );
        const data = await response.json();
        if (Array.isArray(data.itemSuggestionList)) {
          setShowIcons(data.itemSuggestionList);
        } else {
          setShowIcons(["셔츠", "청바지"]);
        }
      } catch (err) {
        console.error("추천 API 요청 중 오류:", err);
        setShowIcons(["자켓", "슬랙스"]);
      }
    });
  }, []);

  useEffect(() => {
    if (!gender) return;
    setLoading(true);
    const encodedColor = encodeURIComponent(selectedColorName);
    fetch(
      `${API_BASE_URL}/api/crawl/onthelook?color=${encodedColor}&gender=${gender}&type=${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLookImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("크롤링 실패:", err);
        setLookImages([]);
        setLoading(false);
      });
  }, [selectedColorName, gender, type]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchTodayTarotLogs();
        setHasResult(data && data.length > 0);
      } catch (err) {
        console.error("타로 로그 로딩 실패:", err);
        setHasResult(false);
      }
    };
    loadLogs();
  }, []);

  return (
    <div className="today-look-wrapper">
      <Header />
      <section className="today-look-section">
        <div className="today-look-header">
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div className="color-box-wrapper">
              <div className="color-box" style={{ backgroundColor: todayColor.hex }} />
              <span className="color-label"> {userColorName ? "행운의 색" : "오늘의 색"} </span>
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
                {getSeasonalMessage()}
              </p>
            </div>
          </div>

          <button
            style={{ marginBottom: "1rem", fontFamily: "'Gowun Dodum', sans-serif" }}
            className="tarot-btn"
            onClick={() => {
              if (hasResult) {
                navigate("/mypage", { state: { activeTab: "tarot" } });
              } else {
                navigate("/horoscope/tarot");
              }
            }}
          >
            {hasResult ? "나의 행운의 색상 보기" : "타로 페이지에서 행운의 색 받기"}
          </button>
        </div>

        <hr style={{ margin: "1.5rem 0" }} />

        <h4 style={{ marginBottom: "1rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
          오늘의 색상 추천 코디
        </h4>

        <div className="filter-and-toggle">
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
            <p style={{ marginTop: "1rem", color: "#555", fontFamily: "'Gowun Dodum', sans-serif", fontSize: "1.1rem" }}>
              오늘의 감성 코디를 불러오는 중입니다...
            </p>
          </div>
        ) : lookImages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#888", fontFamily: "'Gowun Dodum', sans-serif", fontSize: "1.1rem" }}>
              아쉽게도 해당 색상의 추천 코디가 없습니다.
            </p>
          </div>
        ) : (
          <div className={`image-grid ${viewType}`}>
            {lookImages.map((src, i) => (
              <img key={i} src={src} alt={`look-${i}`} />
            ))}
          </div>
        )}

        <FashionIconSection showIcons={showIcons} />
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