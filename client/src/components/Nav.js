import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoIcon from "../assets/svg/sweaticon.svg";
import logoText from "../assets/svg/sweatlogo-paths.svg";
import "../sass/components/_Nav.scss";

export default function Nav() {
  const { auth, signOut } = useAuth();

  const navItems = [
    { name: "Logs", to: "/", authStatus: true, onClick: null },
    { name: "Settings", to: "/settings", authStatus: true, onClick: null },
    { name: "Sign In", to: "/signin", authStatus: false, onClick: null },
    { name: "About", to: "/about", authStatus: null, onClick: null },
    { name: "Sign Out", to: "/signin", authStatus: true, onClick: signOut },
  ];

  function makeListElement(item) {
    return (
      <li key={item.name}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={item.onClick}
        >
          {item.name}
        </NavLink>
      </li>
    );
  }

  return (
    <Fragment>
      <a href="#main" className="off-screen skip-link">
        Skip to main content
      </a>
      <nav className="Nav">
        {auth.token ? (
          <div className="logo-container">
            <NavLink to="/" aria-label="Homepage">
              <img
                src={logoIcon}
                alt="Sweatless Drop Icon"
                className="logo-icon"
              />
              <img src={logoText} alt="Sweatless Logo" className="logo-text" />
            </NavLink>
          </div>
        ) : null}

        <ul>
          {navItems.map((item) => {
            if (item.authStatus === true) {
              return auth.token ? makeListElement(item) : null;
            }
            if (item.authStatus === false) {
              return auth.token ? null : makeListElement(item);
            }
            if (item.authStatus === null) {
              return makeListElement(item);
            }
            return null;
          })}
        </ul>
      </nav>
    </Fragment>
  );
}
