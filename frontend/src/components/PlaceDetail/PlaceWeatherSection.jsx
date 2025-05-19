// components/PlaceDetail/PlaceWeatherSection.jsx
import { useNavigate } from "react-router-dom";

function PlaceWeatherSection({ place, weather, message, fitList }) {
  const navigate = useNavigate();

  return (
    <section className="section-3">
      <div className="place-header">
        <p className="weather-question">오늘 "{place.placeName}"의 날씨는?</p>
        <div className="weather-middle">
          <div className="weather-icon">🌤️</div>
          <div className="weather-temp">{weather.temp}℃</div>
        </div>
        <p className="weather-message">{message}</p>
        {fitList.length > 0 && (
          <div className="recommend-tags">
            <span className="recommend-label">웨더핏 추천:</span>
            {fitList.map((name) => (
              <button
                className="fit-tag"
                key={name}
                onClick={() => navigate(`/today-place/list?keyword=${encodeURIComponent(name)}`)}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PlaceWeatherSection;
