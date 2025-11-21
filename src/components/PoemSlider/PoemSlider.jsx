import React from "react";
import "./PoemSlider.css";
import BigPoemCard from "../BigPoemCard/BigPoemCard";

export default function PoemSlider({ poems, onSelect }) {
  return (
    <div className="horizontal-slider">
      {poems.map((p) => (
        <BigPoemCard key={p.id} poem={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
}
