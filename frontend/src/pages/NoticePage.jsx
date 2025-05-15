// src/pages/NoticePage.jsx
import { useState } from "react";
import Header from "../components/Header";
import NoticeList from "../components/Notice/NoticeList";
import NoticeForm from "../components/Notice/NoticeForm";
import NoticeDetail from "../components/Notice/NoticeDetail";
import NoticeEdit from "../components/Notice/NoticeEdit";

function NoticePage() {
  const [mode, setMode] = useState("list"); // 'list' | 'detail' | 'form' | 'edit'
  const [selectedId, setSelectedId] = useState(null);

  const handleViewDetail = (id) => {
    setSelectedId(id);
    setMode("detail");
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setMode("edit");
  };

  const handleCreate = () => {
    setMode("form");
  };

  const handleBackToList = () => {
    setSelectedId(null);
    setMode("list");
  };

  return (
    <div className="notice-page-wrapper">
              <Header />
      {mode === "list" && (
        <NoticeList onView={handleViewDetail} onCreate={handleCreate} />
      )}
      {mode === "detail" && selectedId && (
        <NoticeDetail id={selectedId} onBack={handleBackToList} onEdit={handleEdit} />
      )}
      {mode === "form" && <NoticeForm onBack={handleBackToList} />}
      {mode === "edit" && selectedId && (
        <NoticeEdit id={selectedId} onBack={handleBackToList} />
      )}
    </div>
  );
}

export default NoticePage;
