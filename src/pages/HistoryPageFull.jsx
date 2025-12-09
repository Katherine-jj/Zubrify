import React, { useState, useEffect } from "react";
import PoemListPage from "../components/PoemListPage/PoemListPage";
import { getLearningHistory, getCurrentUser } from "../directusApi";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const me = await getCurrentUser();
    const data = await getLearningHistory(me.id);

    setHistory(data || []);
  }

  return (
    <PoemListPage
      title="История изучения"
      poems={history}
      backTo="/profile"
    />
  );
}
