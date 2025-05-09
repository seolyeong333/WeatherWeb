import { useState } from "react";

function AiChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`http://localhost:8080/api/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const result = await response.text();
      setAnswer(result);
    } catch (error) {
      setAnswer("⚠️ AI 응답에 실패했습니다.");
      console.error("AI 요청 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🧠 AI에게 질문하기</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="무엇이든 물어보세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border px-4 py-2 rounded text-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "응답 중..." : "질문하기"}
        </button>
      </form>
      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <strong>AI의 답변:</strong>
          <p className="mt-2 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AiChat;
