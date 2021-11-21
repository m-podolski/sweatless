import { ReactComponent as Sweatlogo } from "../assets/svg/sweatlogo-tagline-paths.svg";
import "../sass/components/_Header.scss";

export default function Header() {
  return (
    <header className="Header">
      <div className="logo-container">
        <Sweatlogo aria-hidden="true" />
      </div>
    </header>
  );
}
