import React from "react";
import { getKoreanWeatherDescforWeather } from "../../utils/weatherUtil"; // 경로 수정

// 오늘의 추천 팁 함수
const getTip = (desc, max) => {
  // max (최고 기온) 값이 유효한 숫자인지 먼저 확인합니다.
  if (typeof max !== 'number' || isNaN(max)) {
    // 온도를 알 수 없을 때의 기본 조언
    if (desc.includes("비")) return "☔ 비 예보가 있으니 우산을 챙기세요.";
    if (desc.includes("눈")) return "🌨️ 눈 예보가 있으니 대비하세요.";
    if (desc.includes("맑음")) return "☀️ 맑은 날씨가 예상됩니다! 외출 계획을 세워보세요.";
    if (desc.includes("흐림")) return "☁️ 대체로 흐린 날씨입니다. 활동 시 참고하세요.";
    return "오늘의 날씨를 확인하고 즐거운 하루 보내세요! 😊";
  }

  // 1. 강수 관련 조언 (가장 우선적으로 확인)
  if (desc.includes("비") || desc.includes("소나기")) {
    return "☔ 우산을 꼭 챙기세요! 비가 오고 있으니, 운전과 보행에 주의하세요.";
  }
  if (desc.includes("눈")) {
    return "🌨️ 눈이 내려요! 길이 미끄러울 수 있으니 따뜻하게 입고 안전에 유의하세요.";
  }
  if (desc.includes("천둥") || desc.includes("뇌우")) {
    return "⛈️ 천둥번개가 칠 수 있어요. 외출 시 안전한 곳에 머무르세요.";
  }

  // 2. 극단적인 온도에 대한 조언
  if (max >= 33) { // 매우 더움 (폭염 기준 근접 또는 이상)
    return desc.includes("맑음")
      ? "🌞 폭염 주의! 무더위에 지치지 않도록 충분한 수분 섭취와 자외선 차단은 필수입니다. 한낮 야외활동은 자제하세요."
      : "🥵 매우 무더운 날씨입니다. 실내 활동 위주로 계획하고, 건강 관리에 각별히 신경 쓰세요.";
  }
  if (max >= 28) { // 더움
    return desc.includes("맑음")
      ? "🌞 많이 덥고 햇볕이 강합니다! 자외선 차단과 수분 보충에 신경 쓰세요."
      : "🌡️ 후텁지근하고 더운 날씨예요. 시원한 옷차림과 물을 가까이 하세요.";
  }
  if (max < 0) { // 매우 추움 (영하)
    return "🥶 한파 수준의 강추위입니다! 두꺼운 외투와 방한용품(모자, 장갑, 목도리)을 반드시 착용하세요.";
  }
  if (max < 5) { // 추움
    return "🧥 날씨가 매우 춥습니다. 따뜻한 겨울 외투와 내복 착용을 고려하세요.";
  }
  if (max < 10) { // 쌀쌀함 (기존 조건 유지 및 구체화)
    return "🧥 외투를 준비하세요! 아침저녁으로 특히 쌀쌀할 수 있습니다.";
  }

  // 3. "맑음" 상태와 다양한 온도 조합
  if (desc.includes("맑음")) {
    if (max >= 23 && max < 28) { // 맑고 따뜻함 ~ 약간 더움 (자외선 차단제 언급했던 기존 조건)
      return "☀️ 햇볕이 따사롭고 활동하기 좋은 날씨입니다. 자외선 차단제를 바르면 더욱 좋겠네요!";
    } else if (max >= 15 && max < 23) { // 맑고 쾌적함
      return "☀️ 맑고 상쾌한 봄/가을 날씨! 나들이나 산책하기에 완벽해요.";
    } else { // 맑지만 선선함 (10°C <= max < 15°C)
      return "☀️ 하늘은 맑지만 공기는 선선해요. 가벼운 겉옷이 있으면 활동하기 편할 거예요.";
    }
  }

  // 4. "흐림" 상태와 다양한 온도 조합
  if (desc.includes("흐림")) {
    if (max >= 25 && max < 28) { // 흐리고 더움 (후텁지근)
      return "☁️ 흐리지만 습도가 높아 후텁지근할 수 있어요. 통풍이 잘 되는 옷을 선택하세요.";
    } else if (max >= 18 && max < 25) { // 흐리고 따뜻함/적당함
      return "☁️ 흐리지만 활동하기에 불편함 없는 포근한 날씨입니다.";
    } else if (max >= 10 && max < 18) { // 흐리고 선선함
      return "☁️ 흐리고 약간 선선한 날씨네요. 가벼운 재킷이나 카디건이 유용할 수 있습니다.";
    }
    // 흐리고 10도 미만은 이미 위에서 "쌀쌀함" 또는 "추움"으로 처리됨
    return "☁️ 대체로 흐린 날씨입니다. 야외 활동 계획 시 참고하세요."; // 흐림의 일반적인 경우
  }

  // 5. 기타 (맑음/흐림/비/눈이 아니면서 온도가 중간 범위일 때)
  // 예: "구름조금", "안개", "바람" 등 + 보통 온도
  if (max >= 18 && max < 25) { // 온화하고 활동하기 좋은 일반적인 날씨
    return "🌿 전반적으로 활동하기 좋은 쾌적한 날씨입니다!";
  }
  if (max >= 10 && max < 18) { // 약간 선선하지만 괜찮은 날씨
    return "🍂 활동하기엔 괜찮지만, 약간의 서늘함이 느껴질 수 있어요. 옷차림에 참고하세요.";
  }

  // 6. 모든 조건에 해당하지 않는 경우의 기본 조언
  return "오늘 하루도 날씨에 맞춰 즐겁게 보내세요! 😊";
};

function WeatherDetailSummary({ dailySummary }) {
  if (!dailySummary) return null;

  const rawDesc = dailySummary.weather.description;
  const desc = getKoreanWeatherDescforWeather(rawDesc);
  const max = Math.round(dailySummary.temp_max);
  const min = Math.round(dailySummary.temp_min);

  return (
    <div className="detail-section">
      <h2 className="detail-title">오늘의 날씨 요약</h2>
      <div className="summary-box">
        <p style={{marginTop: "0.3rem", marginBottom: "0.3rem"}}>오늘은 <strong>{desc}</strong>이며, 기온은 <strong>{min}°C ~ {max}°C</strong>입니다.</p>
      </div>
      <div className="recommendation-box">
        <h3 style={{marginTop: "0.3rem", marginBottom: "0.8rem"}}>오늘의 추천</h3>
        <p>{getTip(desc, max)}</p>
      </div>
    </div>
  );
}

export default WeatherDetailSummary;