import useMarkdown from "../hooks/useMarkdown";
import ReactMarkdown from "react-markdown";
import changelog from "../content/CHANGELOG.md";
import "../sass/pages/_Changelog.scss";

export default function Changelog() {
  const markdown = useMarkdown(changelog);

  return (
    <main aria-live="polite" id="main" className="content-page">
      <h1 className="sr-only">Changelog</h1>
      <section className="content Changelog">
        <div className="wrapper">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </section>
    </main>
  );
}
