import iconMap from "../../utils/iconMap"; // 아이콘 매칭 유틸

const FashionIconSection = ({ showIcons }) => {
  if (!Array.isArray(showIcons)) return null;

  if (showIcons.length === 0) {
    return <p className="no-icons-msg">추천 아이템이 없습니다</p>;
  }

  return (
    <div className="feel-temp-container">
      {showIcons.map((item, index) => {
        const engName = iconMap[item] || "default";
        return (
          <div className="feel-temp-tab" key={index}>
            <img
              src={`/icons/${engName}.png`}
              alt={`${item} 아이콘`}
              onError={(e) => (e.target.src = "/icons/default.png")}
            />
            <div className="tooltip-box">{item}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FashionIconSection;