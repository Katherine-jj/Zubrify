import React from "react";
import "./SectionHeader.css";
import { Link } from "react-router-dom";
import arrowIcon from "../../assets/images/arrow.svg";

export default function SectionHeader({ title, link }) {
  return (
    <div className="section-header">
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {link && (
        <Link to={link} className="see-all">
          <img src={arrowIcon} alt="" className="arrow-icon" />
        </Link>
      )}
    </div>
  );
}
