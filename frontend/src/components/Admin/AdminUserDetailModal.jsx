import React from "react";
import { Modal, Button } from "react-bootstrap";

function AdminUserDetailModal({ show, onHide, user }) {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>👤 사용자 상세 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>닉네임:</strong> {user.nickname}</p>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>성별:</strong> {user.gender === "male" ? "남성" : "여성"}</p>
        <p><strong>생년월일:</strong> {user.birthday ? new Date(user.birthday).toLocaleDateString() : "없음"}</p>
        <p><strong>로그인 방식:</strong> {user.provider}</p>
        <p><strong>권한:</strong> {user.auth === "ADMIN" ? "관리자" : "일반 사용자"}</p>
        <p><strong>가입일:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdminUserDetailModal;
