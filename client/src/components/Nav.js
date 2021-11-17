import React from "react";
import { NavLink } from "react-router-dom";
import logoIcon from "../assets/svg/sweaticon.svg";
import logoText from "../assets/svg/sweatlogo-paths.svg";
import "../sass/components/_Nav.scss";

function Nav() {
  return (
    <React.Fragment>
      <a href="#main" className="off-screen skip-link">
        Skip to main content
      </a>
      <nav className="Nav">
        <div className="logo-container">
          <NavLink exact to="/" aria-label="Homepage">
            <img
              src={logoIcon}
              alt="Sweatless Drop Icon"
              className="logo-icon"
            />
            <img src={logoText} alt="Sweatless Logo" className="logo-text" />
          </NavLink>
        </div>
        <ul>
          <li>
            <NavLink exact to="/" activeClassName="active" className="nav-link">
              Logs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              activeClassName="active"
              className="nav-link"
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active" className="nav-link">
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
}

export default Nav;
