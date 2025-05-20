import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlaceImage({ place }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!place?.placeName) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/google/image?name=${encodeURIComponent(place.placeName)}`
        );
        const url = await res.text();
        setImageUrl(url);
      } catch (err) {
        console.error("대표 이미지 로딩 실패:", err);
        setImageUrl("/no-image.jpg");
      }
    };

    fetchImageUrl();
  }, [place]);

  if (!imageUrl) return null;

  return (
    <div className="place-image-container">
      <img
        src={imageUrl}
        alt={place.placeName}
        onError={(e) => (e.target.src = "/no-image.jpg")}
        className="place-image"
      />
    </div>
  );  
}

export default PlaceImage;
