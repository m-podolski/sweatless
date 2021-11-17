import * as d3 from "d3";
import { useRef, useEffect } from "react";

function LogStatsGraph({ graph, datasetKeys, heading }) {
  const chartRef = useRef(null);
  const width = 400;
  const height = 300;

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    const defs = svg.select("defs");

    const margin = { left: 35, right: 5, top: 5, bottom: 25 };

    // Using props directly throws error
    const dataset = graph;

    const series = d3
      .stack()
      .keys(datasetKeys.map((datasetKey) => datasetKey.key))(dataset)
      // eslint-disable-next-line
      .map((d) => (d.forEach((v) => (v.key = d.key)), d));

    // Scales
    const x = d3
      .scaleBand()
      .domain(dataset.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .rangeRound([height - margin.bottom - 25, margin.top]);

    const colours = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(d3.schemeDark2)
      .unknown("#ccc");

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call((g) => g.selectAll(".domain").remove());

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call((g) => g.selectAll(".domain").remove());
    // Bars
    const g = svg
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d, i) => `url(#pattern-chart-${i})`);

    g.selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.name))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .append("title")
      .text((d) => {
        const datapointKey = datasetKeys.find(
          (datasetKey) => d.key === datasetKey.key,
        );
        return `${d.data[d.key] !== null ? d.data[d.key] : ""} ${
          datasetKeys.unit
        }, ${datapointKey.option}, ${datapointKey.field}`;
      });

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    // Labels
    g.selectAll("text")
      .data((d) => d)
      .join("text")
      .attr("class", "text-large text-value")
      .attr("text-anchor", "middle")
      .attr("x", (d) => x(d.data.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d[0]) + (y(d[1]) - y(d[0])) / 2 + 5)
      .text((d) => (d.data[d.key] !== null ? Math.round(d.data[d.key]) : ""));

    g.selectAll(".text-total")
      .data((d) => d)
      .join("text")
      .attr("class", "text-large text-total")
      .attr("text-anchor", "middle")
      .attr("x", (d) => x(d.data.name) + x.bandwidth() / 2)
      .attr("y", y(0) + 20)
      .text((d) => (d.data.total !== null ? Math.round(d.data.total) : ""));

    // Patterns
    const pattern = defs
      .selectAll("pattern")
      .data(series)
      .join("pattern")
      .attr("id", (d, i) => `pattern-chart-${i}`)
      .attr("width", "8")
      .attr("height", "8")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", (d, i) => `rotate(${i * 45})`);

    pattern
      .append("rect")
      .attr("width", "4")
      .attr("height", "8")
      .attr("fill", (d) => colours(d.key));

    pattern
      .append("rect")
      .attr("width", "4")
      .attr("height", "8")
      .attr("transform", "translate(4,0)")
      .attr("fill", (d) => d3.color(colours(d.key)).darker(0.8));
  }, [graph, datasetKeys]);

  return (
    <section>
      <h3 className="ui-heading">{heading}</h3>
      <svg
        ref={chartRef}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${width} ${height}`}
        className="stacked-bar-chart"
      >
        <title>Stacked bar chart of training results</title>
        <defs></defs>
      </svg>
    </section>
  );
}

export default LogStatsGraph;
