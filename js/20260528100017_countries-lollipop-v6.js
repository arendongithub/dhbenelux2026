const accordionWidth = document.getElementById("accordionParent").clientWidth;
const collapsibleOne = document.getElementById("collapseOne");

collapsibleOne.addEventListener("show.bs.collapse", (event) => {
  // set the dimensions and margins of the graph
  const margin_countries = { top: 10, right: 30, bottom: 40, left: 100 },
    //width = 500 - margin.left - margin.right,
    //width_countries = 0,
    height_countries = 500 - margin_countries.top - margin_countries.bottom;

  if (accordionWidth > 516) {
    width_countries =
      ((accordionWidth - margin_countries.left - margin_countries.right) / 2) *
      0.7;
  } else {
    width_countries =
      (accordionWidth - margin_countries.left - margin_countries.right) * 0.7;
  }

  // append the svg object to the body of the page
  const svg_countries = d3
    .select("#countries_lollipop")
    .append("svg")
    .attr("width", "100%")
    .attr(
      "height",
      height_countries + margin_countries.top + margin_countries.bottom,
    )
    .append("g")
    .attr(
      "transform",
      `translate(${margin_countries.left}, ${margin_countries.top})`,
    );

  // Parse the Data
  d3.csv("./data/20260528095627_countries.csv").then(function (data) {
    // sort data
    data.sort(function (b, a) {
      return a.cnt - b.cnt;
    });

    // Add X axis
    const x = d3.scaleLinear().domain([0, 105]).range([0, width_countries]);
    svg_countries
      .append("g")
      .attr("transform", `translate(0, ${height_countries})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height_countries])
      .domain(
        data.map(function (d) {
          return d.Affiliation_Country;
        }),
      )
      .padding(1);
    svg_countries.append("g").call(d3.axisLeft(y));

    // Lines
    svg_countries
      .selectAll("myline")
      .data(data)
      .join("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y1", function (d) {
        return y(d.Affiliation_Country);
      })
      .attr("y2", function (d) {
        return y(d.Affiliation_Country);
      })
      .attr("stroke", "grey");

    // Circles -> start at X=0
    svg_countries
      .selectAll("mycircle")
      .data(data)
      .join("circle")
      .attr("cx", x(0))
      .attr("cy", function (d) {
        return y(d.Affiliation_Country);
      })
      .attr("r", "7")
      .style("fill", "#69b3a2")
      .attr("stroke", "black");

    // Change the X coordinates of line and circle
    svg_countries
      .selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cx", function (d) {
        return x(d.cnt);
      });

    svg_countries
      .selectAll("line")
      .transition()
      .duration(2000)
      .attr("x1", function (d) {
        return x(d.cnt);
      });
  });
});

collapsibleOne.addEventListener("hidden.bs.collapse", (event) => {
  const countries_lollipop = document.getElementById("countries_lollipop");
  while (countries_lollipop.firstChild) {
    countries_lollipop.removeChild(countries_lollipop.firstChild);
  }
});
