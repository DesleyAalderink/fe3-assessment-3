//graph 1 making var for the first svg
var svg = d3.select("#svgtotal"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//graph 2 making var for the second svg
var svg2 = d3.select("#svgdairy"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height") - margin.top - margin.bottom;

var x2 = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y2 = d3.scaleLinear().rangeRound([height, 0]);

var g2 = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// loading the csv data and setting the charset for the footer
d3.text('data.csv').mimeType('text/plain;charset=iso88591').get(onload);
function onload(error, text) {

// cutting unusable text from the data
  if (error) throw error;
  var header = text.indexOf('"Periods";"1 000 kg";"1 000 kg";"1 000 kg";"1 000 kg"')
  var end = text.indexOf('\n', header)

	text = text.slice(end).trim()
  text = text.replace(/number/g, '')
  text = text.replace(/;/g, ',')

  var data = d3.csvParseRows(text, map)
  var cyaFooter = data.indexOf('&copy RVO 1-2-2018');
     var remove = data.splice(cyaFooter);
    console.log(cyaFooter)
  data.pop()

  // map function where I declare the strings to numbers
  function map(d) {
      return {
        year: Number(d[0]),
        number: Number(d[1]),
        butter: Number(d[2]),
        cheese: Number(d[3])
      }

  }

  // Simple Tooltip
var tooltip = d3.select("body").append("div").attr("class", "toolTip");


// The following code is from Titus Wormer
// It searches for the input and if its been selected, if so it must do the fuction onchange
d3.select('input').on('change', onchange);

// Calling the function
function onchange() {

// checking if sorterennumber has been clicked on, if no, it will get sorterenyear
var sort = this.checked ? sorterennumber : sorterenyear;
var x0 = x.domain(data.sort(sort).map(year)).copy();
var transition = svg.transition();

// Sorting the bars
svg.selectAll('.bar').sort(sortBar);

// transitions
transition.selectAll('.bar')
    .delay(delay)
    .attr('x', barX0);

transition.select('.axis--x')
    .call(d3.axisBottom(x))
    .selectAll('g')
    .delay(delay);

// calculating how the bars must be sorted and how they must move
function sortBar(a, b) {
    return x0(year(a)) - x0(year(b));
}

function barX0(d) {
    return x0(year(d));
}

function delay(d, i) {
    return i * 50;
    }
}
  // ordering the number variable
function sorterennumber(a, b) {
    return number(b) - number(a);
}

// ordering the year variable
function sorterenyear(a, b) {
    return d3.ascending(year(a), year(b));
}

// calling the number
function number(d) {
    return d.number;
}

// calling the year
function year(d) {
    return d.year;
}

// making the graph with the x and y as
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.number; })]);

// placing everything on the graph
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.number); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.number); })
      .on("mouseover", function(d) {
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html((d.year) + "<br>" + "" + (d.number));
      })
      .on("mouseout", function(d){ tooltip.style("display", "none");});

      var data2 = [];
      var years = [];
      var yearcompare = '';
      data.forEach(function(d) {
          years.push(d.year);
      })
      yearcompare = years[0];
      data2 = data.filter(filterYear);

      // making empty variables where I want to push the data in for the second graph
          var butterObject = {};
          var cheeseObject = {};
          var newData = [];
      //making a new name which is uqual to butter and making the number from butter equal to the one that's in the data. Same goes for cheese.
          butterObject["number"] = data2[0].butter;
          cheeseObject["name"] = "cheese";
          cheeseObject["number"] = data2[0].cheese;
          newData.push(butterObject);
          newData.push(cheeseObject);


// making the second graph with the y and x as
x2.domain(newData.map(function(d) { return d.name; }));
y2.domain([0, d3.max(data, function(d) { return d.number; })]);

// placing everything on the second graph
g2.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x2));

g2.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y2).ticks(20).tickFormat(d3.format(".0s")))
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");

g2.selectAll(".bar")
  .data(newData)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x2(d.name); })
    .attr("y", function(d) { return y2(d.number); })
    .attr("width", x2.bandwidth())
    .attr("height", function(d) { return height - y2(d.number); })
    .on("mouseover", function(d) {
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html((d.name) + "<br>" + "" + (d.number));
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});

// function that checks if the year is equal to the year in the data
    function filterYear(d) {
        return (d.year === yearcompare)
    }

    // making a click event on all bars. If clicked it must start the onChange function
        d3.selectAll(".bar").on("click", onChange);
    // checks if the year is correct and if it is it will give a class to the bar
        function onChange(a) {
            yearcompare = a.year;
            this.classList.add("active");
            data2 = [];
            newData = [];
            data2 = data.filter(filterYear);
            butterObject["name"] = "butter";
            butterObject["number"] = data2[0].butter;
            cheeseObject["name"] = "cheese";
            cheeseObject["number"] = data2[0].cheese;
            newData.push(butterObject);
            newData.push(cheeseObject);

    // variable for the transition of the bars from the second graph. It checks the attributes and changes them to the correct data
            var movingBar = svg2.selectAll(".bar")
                .data(newData);
            movingBar.transition().duration(750)
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x2(d.name);
                })
                .attr("y", function(d) {
                    return y2(d.number);
                })
                .attr("width", x2.bandwidth())
                .attr("height", function(d) {
                    return height - y2(d.number);
                });
        }
};

// Bronnen: ordering the bars - Titus Wormer (https://github.com/cmda-fe3/course-17-18/tree/master/site/class-4/sort)
// Bronnen: cleaning the code - Slides from the assignments
// Bronnen: basic Help from Wesley Cheng
// Bronnen: main graph - Mike Bostock (https://bl.ocks.org/mbostock/3885304)
// Bronnen: dataset - CBS  (http://statline.cbs.nl/Statweb/publication/?DM=SLEN&PA=7425ENG&D1=0,3-5&D2=155,168,181,194,207,220,233,246,259&LA=EN&HDR=T&STB=G1&VW=T)
