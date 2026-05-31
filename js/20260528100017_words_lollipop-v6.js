//const accordionWidth = document.getElementById("accordionParent").clientWidth;
const collapsibleTwo = document.getElementById("collapseTwo");

collapsibleTwo.addEventListener("show.bs.collapse", (event) => {
  // set the dimensions and margins of the graph
  const margin_words = { top: 10, right: 30, bottom: 40, left: 100 },
    /*width_words =
      document.getElementById("words_lollipop").offsetWidth -
      margin_words.left -
      margin_words.right,*/
    height_words = 500 - margin_words.top - margin_words.bottom;

  if (accordionWidth > 516) {
    width_words =
      ((accordionWidth - margin_words.left - margin_words.right) / 2) * 0.7;
  } else {
    width_words =
      (accordionWidth - margin_words.left - margin_words.right) * 0.7;
  }

  // append the svg object to the body of the page
  const svg_words = d3
    .select("#words_lollipop")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height_words + margin_words.top + margin_words.bottom)
    .append("g")
    .attr("transform", `translate(${margin_words.left}, ${margin_words.top})`);

  // Parse the Data
  d3.csv("./data/20260528201706_word_count_20.csv").then(function (data) {
    // sort data
    data.sort(function (b, a) {
      return a.cnt - b.cnt;
    });

    // Add X axis
    const x = d3.scaleLinear().domain([0, 140]).range([0, width_words]);
    svg_words
      .append("g")
      .attr("transform", `translate(0, ${height_words})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height_words])
      .domain(
        data.map(function (d) {
          return d.word;
        }),
      )
      .padding(1);
    svg_words.append("g").call(d3.axisLeft(y));

    // Lines
    svg_words
      .selectAll("myline")
      .data(data)
      .join("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y1", function (d) {
        return y(d.word);
      })
      .attr("y2", function (d) {
        return y(d.word);
      })
      .attr("stroke", "grey");

    // Circles -> start at X=0
    svg_words
      .selectAll("mycircle")
      .data(data)
      .join("circle")
      .attr("cx", x(0))
      .attr("cy", function (d) {
        return y(d.word);
      })
      .attr("r", "7")
      .style("fill", "#69b3a2")
      .attr("stroke", "black");

    // Change the X coordinates of line and circle
    svg_words
      .selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cx", function (d) {
        return x(d.count);
      });

    svg_words
      .selectAll("line")
      .transition()
      .duration(2000)
      .attr("x1", function (d) {
        return x(d.count);
      });
  });
});

collapsibleTwo.addEventListener("hidden.bs.collapse", (event) => {
  const words_lollipop = document.getElementById("words_lollipop");
  while (words_lollipop.firstChild) {
    words_lollipop.removeChild(words_lollipop.firstChild);
  }
});
