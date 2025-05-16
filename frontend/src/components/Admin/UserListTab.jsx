import { useEffect, useState } from "react";
import AdminUserDetailModal from "./AdminUserDetailModal"; // 모달 임포트

function UserListTab() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // 모달에 보여줄 사용자
  const [showModal, setShowModal] = useState(false);      // 모달 열기/닫기

  useEffect(() => {
    const mockUsers = [
      {
        userId: 1,
        nickname: "장준하",
        email: "hmsdhk@naver.com",
        gender: "male",
        birthday: "2001-01-02",
        provider: "local",
        auth: "USER",
        createdAt: "2024-04-20T10:15:00",
      },
      {
        userId: 2,
        nickname: "장준환",
        email: "j8428820@naver.com",
        gender: "male",
        birthday: "2000-12-21",
        provider: "local",
        auth: "ADMIN",
        createdAt: "2024-04-19T09:50:00",
      },
    ];
    setUsers(mockUsers);
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="admin-section">
      <h4 className="mb-3">👥 전체 사용자 목록</h4>
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>권한</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="5">불러온 사용자 정보가 없습니다.</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId} onClick={() => handleRowClick(user)} style={{ cursor: "pointer" }}>
                <td>{user.userId}</td>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>{user.auth === "ADMIN" ? "관리자" : "사용자"}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 사용자 상세 모달 */}
      <AdminUserDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={selectedUser}
      />
    </div>
  );
}

export default UserListTab;
