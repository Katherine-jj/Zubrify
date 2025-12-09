import React, { useState, useEffect } from "react";
import { getUploadedPoems } from "../directusApi";
import PoemListPage from "../components/PoemListPage/PoemListPage";

export default function UploadedPoemsPage() {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getUploadedPoems();
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
