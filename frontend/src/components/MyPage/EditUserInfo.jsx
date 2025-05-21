// src/components/MyPage/EditUserInfo.jsx
import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EditUserInfo({ userInfo, setUserInfo, fetchUserInfo, setShowEditComponent, handleShowInfoModal }) {
  const [nickname, setNickname] = useState(userInfo.nickname);
  const [gender, setGender] = useState(userInfo.gender);
  const [birthday, setBirthday] = useState(userInfo.birthday);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userInfo.email,
          nickname,
          gender,
          birthday,
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      await fetchUserInfo();
      setModalMessage("정보가 수정되었습니다.");
      setShowModal(true);

      setShowEditComponent(); // info 탭으로 복귀
    } catch (err) {
      console.error(err);
      setModalMessage("수정 중 오류가 발생했습니다.");
      setShowModal(true);
    }
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-4">✏️ 정보 수정</h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>성별</Form.Label>
            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">선택</option>
              <option value="male">남</option>
              <option value="female">여</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>생일</Form.Label>
            <Form.Control type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="primary" onClick={handleSave}>저장</Button>
            <Button variant="secondary" onClick={() => setShowEditComponent()}>취소</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EditUserInfo;