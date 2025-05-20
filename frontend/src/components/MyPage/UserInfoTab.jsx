// src/components/MyPage/UserInfoTab.jsx
import { Button, Card, Row, Col } from "react-bootstrap";

function UserInfoTab({ userInfo, setMode, setShowModal }) {
  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-bold mb-4">👤 회원 정보</h5>
        {userInfo ? (
          <Row className="info-list">
            <Col sm={6} className="mb-3">
              <strong>닉네임</strong>
              <p className="info-value">{userInfo.nickname}</p>
            </Col>
            <Col sm={6} className="mb-3">
              <strong>이메일</strong>
              <p className="info-value">{userInfo.email}</p>
            </Col>
            <Col sm={6} className="mb-3">
              <strong>성별</strong>
              <p className="info-value">
                {userInfo.gender === "male" ? "남성" : userInfo.gender === "female" ? "여성" : "기타"}
              </p>
            </Col>
            <Col sm={6} className="mb-3">
              <strong>생일</strong>
              <p className="info-value">{userInfo.birthday}</p>
            </Col>
            <Col sm={6} className="mb-3">
              <strong>가입일</strong>
              <p className="info-value">{userInfo.createdAt?.substring(0, 10)}</p>
            </Col>
          </Row>
        ) : (
          <p>회원 정보를 불러오는 중입니다...</p>
        )}

        <div className="btn-group-bottom mt-4">
          <Button variant="secondary" onClick={() => {
            setMode("password");
            setShowModal(true);
          }}>
            비밀번호 변경
          </Button>
          <Button variant="primary" onClick={() => {
            setMode("edit");
            setShowModal(true);
          }}>
            정보 수정
          </Button>
          <Button variant="outline-danger" onClick={() => {
            setMode("delete");
            setShowModal(true);
          }}>
            회원 탈퇴
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserInfoTab;
