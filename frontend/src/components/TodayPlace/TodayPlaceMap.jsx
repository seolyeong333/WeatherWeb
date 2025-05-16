import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json";
import { getKoreanWeatherDescription } from "../../api/weatherMapping";
import "./TodayPlaceMap.css";

function TodayPlaceMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const currentInfoRef = useRef(null);
  const placeMarkersRef = useRef([]);
  const showMarkRef = useRef("");

  const [places, setPlaces] = useState([]);
  const [showMark, setShowMark] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [regionName, setRegionName] = useState("서울시 강남구");
  const [weather, setWeather] = useState(null);
  const [lastRegionCode, setLastRegionCode] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    });

    mapInstanceRef.current = map;

    window.kakao.maps.event.addListener(map, "click", async function (mouseEvent) {
      const latLng = mouseEvent.latLng;
      const lat = latLng.getLat();
      const lon = latLng.getLng();

      if (userMarkerRef.current) userMarkerRef.current.setMap(null);

      const marker = new window.kakao.maps.Marker({ map, position: latLng });
      userMarkerRef.current = marker;

      const regionCode = await getAddressFromKakao(lat, lon);

      if (regionCode !== lastRegionCode) {
        setSelectedLocation({ lat, lon });
        setLastRegionCode(regionCode);
        loadWeather(lat, lon);
      }
    });

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const center = new window.kakao.maps.LatLng(lat, lon);
      map.setCenter(center);

      new window.kakao.maps.Marker({
        map,
        position: center,
        title: "내 위치",
        image: new window.kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new window.kakao.maps.Size(24, 35)
        ),
      });

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
        setRegionName(
          `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`
        );
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
      const body = { location: `${lat},${lon}` };
      if (category) body.category = category;

      const res = await fetch("http://localhost:8080/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const answer = await res.text();
      const json = JSON.parse(answer.replace(/```json|```/g, "").trim());
      setPlaces(json);

      placeMarkersRef.current.forEach((m) => m.setMap(null));
      placeMarkersRef.current = [];

      json.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        const marker = new window.kakao.maps.Marker({ map, position, title: place.name });
        placeMarkersRef.current.push(marker);

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:8px;font-size:13px;">📍 ${place.name}</div>`
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          if (currentInfoRef.current) currentInfoRef.current.close();
          if (showMarkRef.current === place.name) {
            setShowMark("");
            currentInfoRef.current = null;
            return;
          }
          infowindow.open(map, marker);
          currentInfoRef.current = infowindow;
          setShowMark(place.name);
        });
      });
    } catch (err) {
      console.error("추천 장소 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      loadRecommendedPlaces(selectedLocation.lat, selectedLocation.lon);
    }
  }, [selectedLocation]);

  const handleCategoryClick = (label) => {
    const map = mapInstanceRef.current;
    const center = map.getCenter();
    loadRecommendedPlaces(center.getLat(), center.getLng(), label);
  };

  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "0 0 0 10px", zIndex: 1 }} />

        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10, display: "flex", gap: "0.5rem" }}>
          {["음식점", "카페", "술집", "공원"].map((label, i) => (
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
              <span style={{ fontSize: "1.2rem" }}>{["🍽️", "☕", "🍺", "🌳"][i]}</span>
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
              <>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {places.map((place, idx) => (
                    <li key={idx}>{place.name}</li>
                  ))}
                </ul>
                <button style={{ marginTop: "0.5rem", width: "100%" }}>Show more</button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TodayPlaceMap;
