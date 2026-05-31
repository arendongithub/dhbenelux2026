// const accordionWidth = document.getElementById("accordionParent").clientWidth;
const collapsibleThree = document.getElementById("collapseThree");

collapsibleThree.addEventListener("show.bs.collapse", (event) => {
  // set the dimensions and margins of the graph
  const margin_abstracts = { top: 10, right: 30, bottom: 30, left: 30 },
    width_abstracts =
      accordionWidth * 0.9 - margin_abstracts.left - margin_abstracts.right,
    height_abstracts = 800 - margin_abstracts.top - margin_abstracts.bottom;

  // append the svg object to the body of the page
  const svg_abstracts = d3
    .select("#abstracts_timeframe")
    .append("svg")
    .attr("width", "100%")
    .attr(
      "height",
      height_abstracts + margin_abstracts.top + margin_abstracts.bottom,
    )
    .append("g")
    .attr(
      "transform",
      `translate(${margin_abstracts.left}, ${margin_abstracts.top})`,
    );

  // create a tooltip
  var tooltip = d3
    .select("#abstracts_timeframe")
    .append("div")
    .style("max-width", "500px")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("top", 0)
    .style("opacity", 0)
    .style("background", "white")
    .style("border-radius", "5px")
    .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
    .style("padding", "10px")
    .style("line-height", "1.4")
    .style("font", "11px sans-serif")
    .style("background-color", "lightgoldenrodyellow");

  getTooltipContent = function (d) {
    return `<div style="font-size: 1.5em; font-weight: bold;">${d.Title}</div>
    <div><span style="color: red; width: 20px; display: inline-block;"><svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: bottom;" viewBox="0 0 16 16" fill="currentColor" class="size-4"><path fill-rule="evenodd" d="M3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3Zm2.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM10 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 10 8Zm-2.378 3c.346 0 .583-.343.395-.633A2.998 2.998 0 0 0 5.5 9a2.998 2.998 0 0 0-2.517 1.367c-.188.29.05.633.395.633h4.244Z" clip-rule="evenodd" /></svg></span><i>&nbsp;${d.Authors}</i></div>
    <div style="padding-top: 2px">${d.Abstract}</div>`;
  };

  // Parse the Data
  d3.dsv(
    ";",
    "./data/20260529203253_dhbenelux2026-abstracts-date-range-cleaned-selection.csv",
  ).then(function (data) {
    data.sort(function (b, a) {
      return a.From - b.From;
    });
    // Add X axis
    const x = d3.scaleLinear().domain([-900, 2024]).range([0, width_abstracts]);
    svg_abstracts
      .append("g")
      .attr("transform", `translate(0, ${height_abstracts})`)
      .call(d3.axisBottom(x));

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height_abstracts])
      .domain(
        data.map(function (d) {
          return d.code;
        }),
      )
      .padding(1);
    svg_abstracts.append("g").call(d3.axisLeft(y));

    // Lines
    svg_abstracts
      .selectAll("myline")
      .data(data)
      .join("line")
      .attr("x1", function (d) {
        return x(d.From);
      })
      .attr("x2", function (d) {
        return x(d.From);
      })
      .attr("y1", function (d) {
        return y(d.code);
      })
      .attr("y2", function (d) {
        return y(d.code);
      })
      .attr("stroke", "#69b3a2")
      .attr("stroke-opacity", "0.5")
      .attr("stroke-width", "12px")
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", "1").html(getTooltipContent(d));
      })
      .on("mousemove", function (event) {
        // use page coordinates so tooltip follows the cursor
        tooltip
          .style("top", event.pageY - 30 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", "0");
      });
    svg_abstracts
      .selectAll("line")
      .transition()
      .duration(2000)
      .attr("x2", function (d) {
        return x(d.To);
      });

    // Circles of variable 1
    svg_abstracts
      .selectAll("mycircle")
      .data(data)
      .join("circle")
      .attr("cx", function (d) {
        return x(d.From);
      })
      .attr("cy", function (d) {
        return y(d.code);
      })
      .attr("r", "6")
      .style("fill", "#69b3a2")
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", "1").html(getTooltipContent(d));
      })
      .on("mousemove", function (event) {
        // use page coordinates so tooltip follows the cursor
        tooltip
          .style("top", event.pageY - 30 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", "0");
      });

    // Circles of variable 2
    svg_abstracts
      .selectAll("mycircle")
      .data(data)
      .join("circle")
      .attr("class", "to")
      .attr("cx", function (d) {
        return x(d.From);
      })
      .attr("cy", function (d) {
        return y(d.code);
      })
      .attr("r", "6")
      .style("fill", "#69b3a2")
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", "1").html(getTooltipContent(d));
      })
      .on("mousemove", function (event) {
        // use page coordinates so tooltip follows the cursor
        tooltip
          .style("top", event.pageY - 30 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", "0");
      });
    svg_abstracts
      .selectAll(".to")
      .transition()
      .duration(2000)
      .attr("cx", function (d) {
        return x(d.To);
      });
  });
});

collapsibleThree.addEventListener("hidden.bs.collapse", (event) => {
  const abstracts_timeframe = document.getElementById("abstracts_timeframe");
  while (abstracts_timeframe.firstChild) {
    abstracts_timeframe.removeChild(abstracts_timeframe.firstChild);
  }
});
