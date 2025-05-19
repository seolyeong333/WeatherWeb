// ColorPickerModal.jsx
// ✅ 색상 선택 모달 컴포넌트
// - TodayLook.jsx에서 색상 선택 버튼을 클릭하면 열림
// - COLORS 배열을 기반으로 20가지 색상 중 하나를 선택 가능

import React from "react";
import { Modal } from "react-bootstrap";
import { COLORS } from "../api/colors"; // 🎨 색상 목록 (이름 + HEX) import

function ColorPickerModal({ show, onClose, onSelect, colors=COLORS }) {
  return (
    <Modal show={show} onHide={onClose} centered 
      dialogClassName={colors.length <= 3 ? "small-color-modal" : "default-color-modal"}
    >
      {/* 모달 상단 헤더 */}
      <Modal.Header closeButton>
        <Modal.Title>색상 선택</Modal.Title>
      </Modal.Header>

      {/* 모달 본문: 색상 목록 */}
      <Modal.Body>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${colors.length <= 3 ? colors.length : 5}, 1fr)`,
            gap: "1.2rem",
            justifyItems: "center", // 가운데 정렬
          }}
        >
          {colors.map((color) => (
            <div
              key={color.name}
              onClick={() => {
                onSelect(color); // 선택한 색상 정보를 상위 컴포넌트로 전달
                onClose();       // 모달 닫기
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* 원형 컬러 박스 */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: color.hex,
                  border: "2px solid #ccc",
                  marginBottom: "6px",
                }}
              ></div>

              {/* 색상 이름 */}
              <span style={{ fontSize: "0.85rem", color: "#333" }}>{color.name}</span>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ColorPickerModal;
