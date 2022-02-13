import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

// TODO: make a link to see quizlet generation page
function Footer() {
  return (
    <div className="footer">
      <code>
        <Link
          to="/keywords"
          style={{
            margin: "1rem",
            textDecoration: "none",
            color: "white",
          }}
        >
          edit or upload
        </Link>
      </code>
    </div>
  );
}

export default Footer;
