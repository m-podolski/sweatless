import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function LogStatsTimeline({ timeline, heading }) {
  const chartRef2 = useRef(null);
  const width = 400;
  const height = 80;

  useEffect(() => {
    const svg = d3.select(chartRef2.current);
    const defs = svg.select("defs");

    // Using props directly throws error
    const dataset = timeline;

    // Scales
    const x = d3.scaleLinear().domain([0, 60]).range([0, width]);

    const colours = d3
      .scaleOrdinal()
      .domain(dataset.map((d) => d.name))
      .range(d3.schemeDark2)
      .unknown("#ccc");

    // Bars
    const g = svg.selectAll("g").data(dataset).join("g").attr("tabindex", "0");

    g.append("title").text(
      (d) =>
        `${d.date === null ? "" : d.date}, ${d.label === null ? "" : d.label}`,
    );

    g.append("rect")
      .attr("x", (d, i) => x(i))
      .attr("width", (d) => x(1))
      .attr("height", height)
      .attr("fill", (d, i) => `url(#pattern-timeline-${i})`);

    // Labels
    g.append("text")
      .attr("class", "text-large text-hidden")
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => x(i) + x(1) / 2)
      .attr("y", height / 2 + 5)
      .text((d) => `${d.label === null ? "" : d.label}`);

    g.append("text")
      .attr("class", "text-small text-hidden")
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => x(i) + x(1) / 2)
      .attr("y", height / 2 + 25)
      .text((d) => `${d.date === null ? "" : d.date}`);

    // Patterns
    const pattern = defs
      .selectAll("pattern")
      .data(dataset)
      .join("pattern")
      .attr("id", (d, i) => `pattern-timeline-${i}`)
      .attr("width", "8")
      .attr("height", "8")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", (d, i) => `rotate(${i * 45})`);

    pattern
      .append("rect")
      .attr("width", "4")
      .attr("height", "8")
      .attr("fill", (d, i) =>
        d.name === null ? "hsla(212, 45%, 80%, 1)" : colours(d.name),
      );

    pattern
      .append("rect")
      .attr("width", "4")
      .attr("height", "8")
      .attr("transform", "translate(4,0)")
      .attr("fill", (d) =>
        d.name === null
          ? "hsla(212, 45%, 80%, 1)"
          : d3.color(colours(d.name)).darker(0.8),
      );
  }, [timeline]);

  return (
    <section>
      <h3 className="ui-heading">{heading}</h3>
      <svg
        ref={chartRef2}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${width} ${height}`}
        className="stacked-bar"
      >
        <title>Stacked bar chart of log timeline</title>
        <defs></defs>
      </svg>
    </section>
  );
}
