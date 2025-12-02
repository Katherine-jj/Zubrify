import React, { useEffect, useState } from "react";
import { directus, getCurrentUser } from "../directusApi";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/images/1.png";

export default function UploadedPoems() {
  const [poems, setPoems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const me = await getCurrentUser();
    if (!me) return navigate("/login");

    const res = await directus.items("poems").readByQuery({
      filter: {
        owner: { _eq: me.id },
        is_user_uploaded: { _eq: true }
      }
    });

    setPoems(res.data || []);
  }

  return (
    <div className="page">
      <h2 className="list-title">Загруженные стихи</h2>

      {poems.map(p => (
        <div
          className="poem-item"
          key={p.id}
          onClick={() => navigate(`/poem/${p.id}`)}
        >
          <img src={p.image || img1} className="poem-thumb" />
          <div className="poem-info">
            <div className="poem-title">{p.title}</div>
            <div className="poem-author">{p.author}</div>
          </div>
          <div className="poem-time">—</div>
        </div>
      ))}
    </div>
  );
}
