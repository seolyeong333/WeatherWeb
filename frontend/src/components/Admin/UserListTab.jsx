import { useEffect, useState } from "react";
import AdminUserDetailModal from "./AdminUserDetailModal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UserListTab() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ 토큰 포함
          },
        });

        if (!res.ok) {
          throw new Error("사용자 목록을 불러오는 데 실패했습니다.");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("❌ 사용자 목록 로드 실패:", err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="notice-section" style={{ marginTop: "-0.3rem", height: "100%" }}>
      <h3>👥 전체 사용자 목록</h3>
      {users.length === 0 ? (
        <p>사용자 정보가 없습니다.</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>권한</th>
              <th>가입일</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>{user.auth === "ADMIN" ? "관리자" : "사용자"}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                  >
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AdminUserDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={selectedUser}
      />
    </div>
  );
}

export default UserListTab;
