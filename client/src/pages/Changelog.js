import useMarkdown from "../hooks/useMarkdown";
import ReactMarkdown from "react-markdown";
import changelog from "../content/CHANGELOG.md";
import "../sass/pages/_Changelog.scss";

function Changelog() {
  const markdown = useMarkdown(changelog);

  return (
    <main aria-live="polite" id="main" className="main">
      <h1 className="sr-only">Changelog</h1>
      <section className="content Changelog">
        <div className="wrapper">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </section>
    </main>
  );
}

export default Changelog;
