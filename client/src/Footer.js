import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// TODO: make a link to see quizlet generation page
function Footer() {
  const location = useLocation();

  return (
    <div className="footer">
      <code>
        <Link
          to={location.pathname === "/keywords" ? "/upload" : "/keywords"}
          style={{
            margin: "1rem",
            textDecoration: "none",
            color: "white",
          }}
        >
          {location.pathname === "/keywords" ? "upload" : "edit"}
        </Link>
      </code>
    </div>
  );
}

export default Footer;
