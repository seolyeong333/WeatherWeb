import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NoticeList from "../components/Notice/NoticeList";
import NoticeForm from "../components/Notice/NoticeForm";
import NoticeDetail from "../components/Notice/NoticeDetail";
import NoticeEdit from "../components/Notice/NoticeEdit";

function NoticePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "list";
  const selectedId = searchParams.get("id");

  // 이동 함수들
  const goToList = () => setSearchParams({ mode: "list" });
  const goToDetail = (id) => setSearchParams({ mode: "detail", id });
  const goToEdit = (id) => setSearchParams({ mode: "edit", id });
  const goToForm = () => setSearchParams({ mode: "form" });

  return (
    <div className="notice-page-wrapper">
      <Header />

      {mode === "list" && (
        <NoticeList onView={goToDetail} onCreate={goToForm} />
      )}

      {mode === "detail" && selectedId && (
        <NoticeDetail id={selectedId} onBack={goToList} onEdit={goToEdit} />
      )}

      {mode === "edit" && selectedId && (
        <NoticeEdit id={selectedId} onBack={goToList} />
      )}

      {mode === "form" && <NoticeForm onBack={goToList} />}
    </div>
  );
}

export default NoticePage;
