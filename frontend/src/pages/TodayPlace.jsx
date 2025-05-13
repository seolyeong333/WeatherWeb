import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TodayPlaceList from "../components/TodayPlace/TodayPlaceList";
import TodayPlaceMap from "../components/TodayPlace/TodayPlaceMap";
import PlaceDetail from "../components/TodayPlace/PlaceDetail";
import Header from "../components/Header";


function TodayPlace() {
  const location = useLocation();

  return (
    <>
      <Header />
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            width: "90%",
            maxWidth: "1200px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 0 8px rgba(0,0,0,0.05)",
            overflow: "hidden",
            minHeight: "80vh",
          }}
        >
          {/* 사이드바 */}
          <aside
            style={{
              width: "200px",
              backgroundColor: "#f5f5f5",
              padding: "1rem",
              boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
            }}
          >
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}>
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
              <li>
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
          <main style={{ flex: 1, padding: "2rem", backgroundColor: "#fff" }}>
            <Routes>
              <Route index element={<Navigate to="/today-place/list" replace />} />
              <Route path="/list" element={<TodayPlaceList />} />
              <Route path="/map" element={<TodayPlaceMap />} />
              <Route path="place-detail" element={<PlaceDetail/>} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default TodayPlace;