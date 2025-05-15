// src/components/MyPage/UserInfoTab.jsx
import { Button, Card } from "react-bootstrap";

function UserInfoTab({ userInfo, setMode, setShowModal }) {

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">👤 회원 정보</h5>
        {userInfo ? (
          <>
            <p><strong>닉네임:</strong> {userInfo.nickname}</p>
            <p><strong>이메일:</strong> {userInfo.email}</p>
            <p><strong>성별:</strong> {userInfo.gender}</p>
            <p><strong>생일:</strong> {userInfo.birthday}</p>
            <p><strong>가입일:</strong> {userInfo.createdAt?.substring(0, 10)}</p>
          </>
        ) : <p>회원 정보를 불러오는 중입니다...</p>}
        <div className="mt-3">
        <Button variant="secondary" className="px-4" onClick={() => {
          setMode("password"); // 모드 지정
          setShowModal(true);  // 비밀번호 확인 모달 열기
        }} >
        비밀번호 변경
      </Button>
        <Button variant="primary" className="me-2 px-4" onClick={() => {
            setMode("edit");
            setShowModal(true);
        }}>
            정보 수정
          </Button>
          <Button variant="outline-danger" className="px-4" onClick={() => {
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
