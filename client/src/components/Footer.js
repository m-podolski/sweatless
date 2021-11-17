import { Link } from "react-router-dom";
import "../sass/components/_Footer.scss";

function Footer() {
  return (
    <footer className="Footer">
      <section aria-labelledby="contactinfo-heading" className="contactinfo">
        <strong id="contactinfo-heading" className="heading">
          Contact Information
        </strong>
        <ul>
          <li>
            <span>Github</span>
            <a
              href="https://github.com/m-podolski"
              target="_blank"
              rel="noreferrer"
            >
              github.com/m-podolski
            </a>
          </li>
          <li>
            <span>LinkedIn</span>
            <a
              href="https://www.linkedin.com/in/m-podolski"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/m-podolski
            </a>
          </li>
          <li>
            <span>E-Mail</span>
            <a href="mailto:malte.podolski@web.de">malte.podolski@web.de</a>
          </li>
        </ul>
      </section>
      <section aria-labelledby="appinfo-heading">
        <strong id="appinfo-heading" className="heading">
          Sweatless 0.1.0
        </strong>
        <ul>
          <li>
            <a
              href="https://github.com/m-podolski/sweatless"
              target="_blank"
              rel="noreferrer"
            >
              Sweatless@Github
            </a>
          </li>
          <li>
            <Link to="/changelog">Changelog</Link>
            {/* <a
              href="https://github.com/m-podolski/sweatless"
              target="_blank"
              rel="noreferrer"
            >
              Changelog
            </a> */}
          </li>
          <li>
            <span>2021 by Malte Podolski</span>
          </li>
        </ul>
      </section>
    </footer>
  );
}

export default Footer;
