import { Fragment } from "react";
import Header from "../components/Header";
import useMarkdown from "../hooks/useMarkdown";
import ReactMarkdown from "react-markdown";
import about from "../content/About.md";

export default function About() {
  const markdown = useMarkdown(about);

  return (
    <Fragment>
      <Header />
      <main aria-live="polite" id="main" className="content-page">
        <h1 className="sr-only">About</h1>
        <section className="content">
          <div className="wrapper">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
