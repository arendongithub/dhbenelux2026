collapsibleTwo.addEventListener("show.bs.collapse", (event) => {
  // set the dimensions and margins of the graph
  const margin_topics = {
      top: 10,
      right: 30,
      bottom: 90,
      left: 40,
    },
    /*width_topics =
      document.getElementById("topics_bar").offsetWidth -
      margin_topics.left -
      margin_topics.right,*/
    height_topics = 500 - margin_topics.top - margin_topics.bottom;

  if (accordionWidth > 516) {
    width_topics =
      ((accordionWidth - margin_topics.left - margin_topics.right) / 2) * 0.7;
  } else {
    width_topics =
      (accordionWidth - margin_topics.left - margin_topics.right) * 0.7;
  }

  // append the svg object to the body of the page
  const svg_topics = d3
    .select("#topics_bar")
    .append("svg")
    .attr("width", "100%")
    .attr(
      "height",
      height_topics + 100 + margin_topics.top + margin_topics.bottom,
    )
    .append("g")
    .attr("transform", `translate(${margin_topics.left},${margin_topics.top})`);

  // Parse the Data
  d3.csv("./data/20260528090252_topics.csv").then(function (data) {
    // X axis
    const x = d3
      .scaleBand()
      .range([0, width_topics])
      .domain(data.map((d) => d.Topic))
      .padding(0.2);
    svg_topics
      .append("g")
      .attr("transform", `translate(0,${height_topics})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 90]).range([height_topics, 0]);
    svg_topics.append("g").call(d3.axisLeft(y));
    // Bars
    svg_topics
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Topic))
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr("height", (d) => height_topics - y(0)) // always equal to 0
      .attr("y", (d) => y(0));

    // Animation
    svg_topics
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.cnt))
      .attr("height", (d) => height_topics - y(d.cnt))
      .delay((d, i) => {
        console.log(i);
        return i * 100;
      });
  });
});

collapsibleTwo.addEventListener("hidden.bs.collapse", (event) => {
  const topics_bar = document.getElementById("topics_bar");
  while (topics_bar.firstChild) {
    topics_bar.removeChild(topics_bar.firstChild);
  }
});
