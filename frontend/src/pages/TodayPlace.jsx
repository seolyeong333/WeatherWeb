import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TodayPlaceList from "../components/TodayPlace/TodayPlaceList";
import TodayPlaceMap from "../components/TodayPlace/TodayPlaceMap";
import PlaceDetail from "../components/TodayPlace/PlaceDetail";
import Header from "../components/Header";
import "../styles/Background.css";


function TodayPlace() {
  const location = useLocation();

  return (
    <div className="background-wrapper">
      <Header />
      <div className="common-background">
        <div className="common-container">
          {/* 사이드바 */}
          <aside className="common-sidebar">
            <ul className="sidebar-list">
              <li className="sidebar-item">
                <Link
                  to="/today-place/list"
                  style={{
                    textDecoration: "none",
                    color: location.pathname.includes("list") ? "#000" : "#333",
                    fontWeight: location.pathname.includes("list") ? "bold" : "normal",
                  }}
                >
                  목록 보기
                </Link>
              </li>
              <li className="sidebar-item">
                <Link
                  to="/today-place/map"
                  style={{
                    textDecoration: "none",
                    color: location.pathname.includes("map") ? "#000" : "#333",
                    fontWeight: location.pathname.includes("map") ? "bold" : "normal",
                  }}
                >
                  지도 보기
                </Link>
              </li>
            </ul>
          </aside>
          {/* 콘텐츠 */}
          <main style={{ flex: 1, padding: "2rem" }}>
            <Routes>
              <Route index element={<Navigate to="/today-place/list" replace />} />
              <Route path="/list" element={<TodayPlaceList />} />
              <Route path="/map" element={<TodayPlaceMap />} />
              <Route path="place-detail" element={<PlaceDetail/>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TodayPlace;