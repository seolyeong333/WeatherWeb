import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json";
import { getKoreanWeatherDescription } from "../../api/weatherMapping";
import "../../styles/TodayPlace/TodayPlaceMap.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TodayPlaceMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const clickMarkerRef = useRef(null); // ✅ 클릭 마커 분리
  const placeMarkersRef = useRef([]);
  const labelOverlaysRef = useRef([]);
  const showMarkRef = useRef("");

  const [places, setPlaces] = useState([]);
  const [showMark, setShowMark] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [regionName, setRegionName] = useState("서울시 강남구");
  const [weather, setWeather] = useState(null);
  const [lastRegionCode, setLastRegionCode] = useState(null);

  const navigate = useNavigate();

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  useEffect(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    });
    mapInstanceRef.current = map;

    // ✅ 지도 클릭 시 클릭 마커만 생성
    window.kakao.maps.event.addListener(map, "click", async function (mouseEvent) {
      const latLng = mouseEvent.latLng;
      const lat = latLng.getLat();
      const lon = latLng.getLng();

      if (clickMarkerRef.current) clickMarkerRef.current.setMap(null);
      const marker = new window.kakao.maps.Marker({ map, position: latLng });
      clickMarkerRef.current = marker;

      const regionCode = await getAddressFromKakao(lat, lon);

      if (regionCode !== lastRegionCode) {
        setSelectedLocation({ lat, lon });
        setLastRegionCode(regionCode);
        loadWeather(lat, lon);
      }
    });

    // ✅ 초기 내 위치 마커 생성
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const center = new window.kakao.maps.LatLng(lat, lon);
      map.setCenter(center);

      const marker = new window.kakao.maps.Marker({
        map,
        position: center,
        title: "내 위치",
        image: new window.kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
          new window.kakao.maps.Size(36, 48),
          new window.kakao.maps.Point(18, 48)
        ),
      });
      userMarkerRef.current = marker;

      const regionCode = await getAddressFromKakao(lat, lon);
      setLastRegionCode(regionCode);
      setSelectedLocation({ lat, lon });
      loadWeather(lat, lon);
    });
  }, []);

  useEffect(() => {
    showMarkRef.current = showMark;
  }, [showMark]);

  const getAddressFromKakao = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
        { headers: { Authorization: `KakaoAK e7c76873999ef901948568fdbf33233b` } }
      );
      if (res.data.documents.length > 0) {
        const region = res.data.documents[0];
        setRegionName(`${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`);
        return region.code;
      }
    } catch (err) {
      console.error("주소 변환 실패:", err);
    }
    return null;
  };

  const loadWeather = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4f673522ff69c4d615b1e593ce6fa16b&units=metric&lang=kr`
      );
      const temp = res.data.main.temp.toFixed(1);
      const desc = res.data.weather[0].description;
      setWeather({ temp, desc: getKoreanWeatherDescription(desc) });
    } catch (err) {
      console.error("날씨 정보 실패:", err);
      setWeather(null);
    }
  };

  const loadRecommendedPlaces = async (lat, lon, category = null) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setLoading(true);
    try {
      const url = category
        ? `${API_BASE_URL}/api/kakao/places?lat=${lat}&lon=${lon}&category=${category}`
        : `${API_BASE_URL}/api/kakao/places?lat=${lat}&lon=${lon}`;

      const res = await fetch(url);
      const json = await res.json();
      setPlaces(json);

      placeMarkersRef.current.forEach((m) => m.setMap(null));
      placeMarkersRef.current = [];
      labelOverlaysRef.current.forEach((l) => l.setMap(null));
      labelOverlaysRef.current = [];

      json.forEach((place, idx) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        const marker = new window.kakao.maps.Marker({
          map,
          position,
          title: place.placeName,
        });

        const label = new window.kakao.maps.CustomOverlay({
          position,
          content: `<div class="map-label">${idx + 1}</div>`,
          yAnchor: 1.8,
          zIndex: 3,
        });
        label.setMap(map);

        placeMarkersRef.current.push(marker);
        labelOverlaysRef.current.push(label);

        window.kakao.maps.event.addListener(marker, "click", () => {
          navigate("/today-place/place-detail", { state: { placeName: place.placeName, place } });
        });
      });
    } catch (err) {
      console.error("카카오 추천 장소 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      loadRecommendedPlaces(selectedLocation.lat, selectedLocation.lon, "CE7");
    }
  }, [selectedLocation]);

  const handleCategoryClick = (label) => {
    const map = mapInstanceRef.current;
    const center = map.getCenter();
    const categoryCode = categoryCodeMap[label];
    loadRecommendedPlaces(center.getLat(), center.getLng(), categoryCode);
  };

  const handlePlaceClick = (place) => {
    navigate("/today-place/place-detail", { state: { placeName: place.placeName, place } });
  };

  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "0 0 0 10px", zIndex: 1 }} />

        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10, display: "flex", gap: "0.5rem" }}>
          {["음식점", "카페", "관광명소"].map((label, i) => (
            <button
              key={label}
              onClick={() => handleCategoryClick(label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.4rem 0.8rem",
                border: "none",
                backgroundColor: "#fff",
                borderRadius: "30px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{["🍽️", "☕", "🌳"][i]}</span>
              <span style={{ color: "#333", fontSize: "0.95rem" }}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ position: "absolute", right: "20px", top: "20px", width: "240px", display: "flex", flexDirection: "column", gap: "1rem", zIndex: 10 }}>
          <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h5 style={{ marginBottom: "0.5rem" }}>🌤️ 오늘의 날씨</h5>
            <p>{regionName}</p>
            <p>{weather ? `${weather.temp}°C / ${weather.desc}` : "날씨 정보 없음"}</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h5>📍 추천 플레이스</h5>
            {loading ? (
              <>
                <Lottie animationData={loadingAnimation} loop={true} style={{ width: 100, height: 100, margin: "0 auto" }} />
                <p style={{ fontSize: "0.95rem", color: "#555" }}>ONDA AI의 추천 장소 정보를 불러오는 중입니다…</p>
              </>
            ) : (
              <div style={{ maxHeight: "160px", overflowY: "auto" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {places.map((place, idx) => (
                    <li
                      key={idx}
                      onClick={() => handlePlaceClick(place)}
                      style={{ cursor: "pointer", padding: "4px 0", color: "#0077cc" }}
                    >
                      {idx + 1}. {place.placeName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TodayPlaceMap;