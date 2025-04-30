import { useState } from "react";
import { Tab, Nav, Row, Col, Card, Button } from "react-bootstrap";
import Header from "../components/Header";
import { FaUser, FaCommentDots, FaExclamationCircle } from "react-icons/fa"; // 아이콘 사용
import './MyPage.css';
function MyPage() {
  const [userInfo] = useState({
    nickname: "홍길동",
    email: "hong@example.com",
    joinedAt: "2024-12-15",
  });

  return (
    <>
      <Header />

      <div className="container mt-5 mb-5">
        <h2 className="fw-bold mb-4">👤 마이페이지</h2>
        <Tab.Container defaultActiveKey="info">
          <Row>
            {/* 좌측 탭 메뉴 */}
            <Col md={3} className="mb-3">
              <Nav variant="pills" className="flex-column shadow-sm rounded-3 p-3 bg-light">
                <Nav.Item>
                  <Nav.Link eventKey="info" className="d-flex align-items-center gap-2">
                    <FaUser /> 내 정보
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews" className="d-flex align-items-center gap-2">
                    <FaCommentDots /> 한줄평 관리
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reports" className="d-flex align-items-center gap-2">
                    <FaExclamationCircle /> 신고 내역
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* 우측 내용 영역 */}
            <Col md={9}>
              <Tab.Content>
                {/* 1. 내 정보 */}
                <Tab.Pane eventKey="info">
                  <Card className="shadow-sm rounded-4">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">👤 회원 정보</h5>
                      <p><strong>닉네임:</strong> {userInfo.nickname}</p>
                      <p><strong>이메일:</strong> {userInfo.email}</p>
                      <p><strong>가입일:</strong> {userInfo.joinedAt}</p>
                      <div className="mt-3">
                        <Button variant="primary" className="me-2 px-4">정보 수정</Button>
                        <Button variant="outline-danger" className="px-4">회원 탈퇴</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* 2. 한줄평 관리 */}
                <Tab.Pane eventKey="reviews">
                  <Card className="shadow-sm rounded-4">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">💬 내가 남긴 한줄평</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span>🌳 서울숲 - “산책하기 좋아요”</span>
                          <Button size="sm" variant="outline-danger">삭제</Button>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span>☕ 카페 마마스 - “샐러드 굿!”</span>
                          <Button size="sm" variant="outline-danger">삭제</Button>
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* 3. 신고 내역 */}
                <Tab.Pane eventKey="reports">
                  <Card className="shadow-sm rounded-4">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">🚨 신고한 내역</h5>
                      <p>총 <strong>2건</strong>의 신고를 접수했습니다.</p>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">🏞️ 장소 “XX공원” - 정보 오류 신고 (2025-04-28)</li>
                        <li className="list-group-item">💬 한줄평 “욕설 포함” - 부적절 신고 (2025-04-15)</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}

export default MyPage;
