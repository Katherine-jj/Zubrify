import React, { useState, useEffect } from "react";
import { getUploadedPoemsByUser, getCurrentUser } from "../directusApi";
import PoemListPage from "../components/PoemListPage/PoemListPage";

export default function UploadedPoemsPage() {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const me = await getCurrentUser();
    if (!me) return;

    const data = await getUploadedPoemsByUser(me.id);
    setPoems(data || []);
  }

  return (
    <PoemListPage
      title="Мои стихи"
      poems={poems}
      backTo="/profile"
      showTime={false}
    />
  );
}
