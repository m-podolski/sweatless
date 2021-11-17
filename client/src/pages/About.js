import React from "react";
import Header from "../components/Header";
import useMarkdown from "../hooks/useMarkdown";
import ReactMarkdown from "react-markdown";
import about from "../content/About.md";

function About() {
  const markdown = useMarkdown(about);

  return (
    <React.Fragment>
      <Header />
      <main aria-live="polite" id="main" className="main">
        <h1 className="sr-only">About</h1>
        <section className="content">
          <div className="wrapper">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}

export default About;
