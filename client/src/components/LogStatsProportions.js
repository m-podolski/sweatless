import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function LogStatsProportions({ dataset, heading }) {
  const chartRef = useRef(null);
  const width = 400;
  const height = 80;

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    const defs = svg.select("defs");

    // Using props directly throws error
    const datasetLocal = dataset;

    // Scales
    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

    const colours = d3
      .scaleOrdinal()
      .domain(datasetLocal.map((d) => d.label))
      .range(d3.schemeDark2)
      .unknown("#ccc");

    // Bars
    const g = svg
      .selectAll("g")
      .data(datasetLocal)
      .join("g")
      .attr("tabindex", "0");

    g.append("title").text(
      (d) => `${d.label}, ${d.count} Logs, ${d.percent} Percent`,
    );

    g.append("rect")
      .attr("x", (d) => x(d.cumulated))
      .attr("width", (d) => x(d.percent))
      .attr("height", height)
      .attr("fill", (d, i) => `url(#pattern-proportions-${i})`);

    // Labels
    g.append("text")
      .attr("class", "text-large text-visible")
      .attr("text-anchor", "middle")
      .attr("x", (d) => x(d.cumulated) + x(d.percent) / 2)
      .attr("y", height / 2 + 5)
      .text((d) => `${d.percent}`);

    g.append("text")
      .attr("class", "text-small text-hidden")
      .attr("text-anchor", "middle")
      .attr("x", (d) => x(d.cumulated) + x(d.percent) / 2)
      .attr("y", height / 2 + 25)
      .text((d) => `${d.label}`);

    // Patterns
    const pattern = defs
      .selectAll("pattern")
      .data(datasetLocal)
      .join("pattern")
      .attr("id", (d, i) => `pattern-proportions-${i}`)
      .attr("width", "8")
      .attr("height", "8")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", (d, i) => `rotate(${i * 45})`);

    pattern
      .append("rect")
      .attr("width", "4")
      .attr("height", "8")
      .attr("fill", (d) => colours(d.label));

    pattern
      .append("rect")
      .attr("width", "4")
      .attr("height", "8")
      .attr("transform", "translate(4,0)")
      .attr("fill", (d) => d3.color(colours(d.label)).darker(0.8));
  }, [dataset]);

  return (
    <section>
      <h3 className="ui-heading">{heading}</h3>
      <svg
        ref={chartRef}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${width} ${height}`}
        className="stacked-bar"
      >
        <title>Stacked bar chart of training type proportions</title>
        <defs></defs>
      </svg>
    </section>
  );
}
