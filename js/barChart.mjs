import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function barChart(
  selector,
  attributes = {
    width: 800,
    height: 400,
    margin: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60,
    },
    colors: ["#ff7f0e", "#2ca02c", "#1f77b4"],
  }
) {
  const {
    width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 60, left: 60 },
    colors = ["#ff7f0e", "#2ca02c", "#1f77b4"],
  } = attributes;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "linear-gradient(to bottom, #333, #111)")
    .style("border-radius", "10px")
    .style("box-shadow", "0 10px 30px rgba(0,0,0,0.3)");

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([0, 10]) // Fixed domain for initial scaling
    .range([0, width - margin.left - margin.right]);

  const yScale = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, 0]);

  const xAxis = chart
    .append("g")
    .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  const yAxis = chart.append("g").call(d3.axisLeft(yScale));

  // Tooltip for live data
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("padding", "8px")
    .style("display", "none");

  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  // Initial rendering
  const update = (data) => {
    const lastDataPoint = data.length - 1;
    xScale.domain([lastDataPoint - 10, lastDataPoint]); // Adjusting domain to show the last 10 points

    yScale.domain([
      0,
      d3.max(data, (d) => d.value) * 1.2, // Dynamic Y scale based on values
    ]);

    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));

    const lines = chart.selectAll(".line").data([data]);

    lines.exit().remove();

    lines
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d, i) => colors[i % colors.length])
      .attr("stroke-width", 2)
      .merge(lines)
      .transition()
      .duration(1000)
      .attr("d", line);

    // Add points (circles) for each line
    const points = chart.selectAll(".point").data(data);

    points.exit().remove();

    points
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("fill", (d, i) => colors[i % colors.length])
      .attr("r", 4)
      .on("mouseover", (event, d) => {
        tooltip
          .html(`Price: $${d.value.toFixed(2)}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 30}px`)
          .style("display", "block");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      })
      .merge(points)
      .transition()
      .duration(1000)
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", (d) => yScale(d.value));
  };

  return { update };
}
