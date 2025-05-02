import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동용 훅

function Signup() {
  // 📦 사용자 입력값을 저장하는 상태
  const [formData, setformData] = useState({
    userId: "",       // 아이디
    email: "",        // 이메일
    password: "",     // 비밀번호
    nickname: "",     // 닉네임
    gender: ""        // 성별
  });

  const navigate = useNavigate(); // ✅ 회원가입 후 로그인 페이지로 이동하기 위해 사용

  // 🔄 입력 값 변경 처리
  const changeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value // 입력된 name에 해당하는 값만 갱신
    });
  };

  // 📡 폼 제출 시 서버로 POST 요청 전송
  const submitHandler = async (e) => {
    e.preventDefault(); // 기본 폼 제출 막기

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // JSON 데이터로 전송
        },
        body: JSON.stringify(formData)       // formData 객체 → JSON 문자열
      });

      if (response.ok) {
        alert("회원가입 성공!");     // ✅ 성공 알림 후
        navigate("/login");         // 로그인 페이지로 이동
      } else {
        alert("회원가입 실패 ㅠㅠ"); // 실패 시 알림
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류 발생"); // 네트워크 등 에러
    }
  };

  // 🎨 화면 UI 구성
  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>회원가입</h2>
      <form onSubmit={submitHandler}>
        {/* 아이디 입력 */}
        <input
          type="text"
          name="userId"
          placeholder="아이디"
          value={formData.userId}
          onChange={changeHandler}
          required
        /><br /><br />

        {/* 이메일 입력 */}
        <input
          type="text"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={changeHandler}
          required
        /><br /><br />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={changeHandler}
          required
        /><br /><br />

        {/* 닉네임 입력 */}
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={changeHandler}
          required
        /><br /><br />

        {/* 성별 선택 */}
        <select
          name="gender"
          value={formData.gender}
          onChange={changeHandler}
          required
        >
          <option value="">성별 선택</option>
          <option value="male">남자</option>
          <option value="female">여자</option>
        </select><br /><br />

        {/* 제출 버튼 */}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
