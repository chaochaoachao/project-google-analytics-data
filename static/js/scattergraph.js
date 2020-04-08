var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var email_list = []
var clusters = [];
var selectedDots;
var email = [];



// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial params
var chartData = null;

var chosenXAxis = 'totals_pageviews'
var chosenYAxis = 'totals_transactionRevenue'

var xAxisLabels = ["totals_pageviews", "visitNumber", "totals_hits"];  // Default 
var yAxisLabels = ["totals_transactionRevenue"];
var labelsTitle = { "totals_pageviews": "total page views", 
                    "visitNumber": "visitNumber", 
                    "totals_hits": "totals_hits",
                    "total revenue": "total number of revenue $" };

function xScale(nonzeroData,chosenXAxis){
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(nonzeroData, d=>d[chosenXAxis]-1), d3.max(nonzeroData,d=>d[chosenXAxis])*1])
      .range([-5,width])
  return xLinearScale;

}

function yScale(nonzeroData, chosenYAxis) {
  // Create Scales.

  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(nonzeroData, d => d[chosenYAxis]-1),d3.max(nonzeroData, d => d[chosenYAxis])*1.2])
      .range([height, 0]);

  return yLinearScale;
}

    // Function used for updating xAxis var upon click on axis label.
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

  return xAxis;
}

// Function used for updating circles group with a transition to new circles.
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// Function used for updating text in circles group with a transition to new text.
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
      
  return circletextGroup;
}

// Function used for updating circles group with new tooltip.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // X Axis
  if (chosenXAxis === "totals_pageviews") {
    var xlabel = "totals_pageviews: "
    var ylabel = "totals_hits: "
    var zlabel = "visitNumber: "
    var x1label = "totals_pageviews"
    var y1label = "totals_hits"
    var z1label = "visitNumber"
    var id = "fullVisitorId: "
    var idlabel = "fullVisitorId"
  }
  else if (chosenXAxis === "visitNumber") {
    var xlabel = "visitNumber: "
    var ylabel = "totals_hits: "
    var zlabel = "totals_pageviews: "
    var x1label = "visitNumber"
    var y1label = "totals_hits"
    var z1label = "totals_pageviews"
    var id = "fullVisitorId: "
    var idlabel = "fullVisitorId"
  }
  else if (chosenXAxis === "totals_hits") {
      var xlabel = "totals_hits: "
      var ylabel = "totals_pageviews: "
      var zlabel = "visitNumber: "
      var x1label = "totals_hits"
      var y1label = "totals_pageviews"
      var z1label = "visitNumber"
      var id = "fullVisitorId: "
      var idlabel = "fullVisitorId"
  }

 
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .style("background", "black")
  .style("color", "white")
  .offset([120, -60])
  .html(function(d) {
      if (chosenXAxis === "totals_hits") {
          // All yAxis tooltip labels presented and formated as %.
          // Display Age without format for xAxis.
          return (`<hr>${id}${d[idlabel]}<br>${xlabel}${d[x1label]}<br>${ylabel} ${d[y1label]}<br>${zlabel}${d[z1label]}`);
        } else if (chosenXAxis === "totals_pageviews") {
          // Display Income in dollars for xAxis.
          return (`<hr>${id}${d[idlabel]}<br>${xlabel}${d[x1label]}<br>${ylabel}${d[y1label]}<br>${zlabel}${d[z1label]}`);
        } else {
          // Display Poverty as percentage for xAxis.
          return (`<hr>${id}${d[idlabel]}<br>${xlabel}${d[x1label]}<br>${ylabel}${d[y1label]}<br>${zlabel}${d[z1label]}`);
        }      
  });

  circlesGroup.call(toolTip);
  //mouseon event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
  //mouseout event
   .on("mouseout", function(data,index) {
    toolTip.hide(data)
  });

return circlesGroup;
}


// Import Data
d3.csv("../static/data/scaled.csv").then(function(nonzeroData) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    nonzeroData.forEach(function(data) {
      data.fullVisitorId = +data.fullVisitorId;
      data.totals_pageviews = +data.totals_pageviews;
      data.totals_hits = +data.totals_hits;
      data.visitNumber = +data.visitNumber;
      data.totals_transactionRevenue = +data.totals_transactionRevenue;
    });

    // Step 2: xlinear scale function above csv import
    // ==============================
    var xLinearScale = xScale(nonzeroData, chosenXAxis);
    var yLinearScale = yScale(nonzeroData, chosenYAxis);


    // Step 3: Create xy axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

      
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(nonzeroData)
    .enter()
    .append("circle")
    .attr("id",function(d) {return "id:" + d.fullVisitorId;}) // added
    .attr("class", "dot")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "2.5")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var pageviewsLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("value", "totals_pageviews") // value to grab for event listener.
        .classed("active", true)
        .text("Total page views");
    
    var vistornumberLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 25)
        .attr("value", "visitNumber") // value to grab for event listener.
        .classed("active", true)
        .text("Total number of visits");

    var hitsLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "totals_hits") // value to grab for event listener.
        .classed("inactive", true)
        .text("Total number of hits");


    var totalrevenueLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 150 )
        .attr("y", -490 )
        .attr("value", "totalrevenue") // value to grab for event listener.
        .classed("inactive", true)
        .text("Total number of revenue $");

    // Update tool tip function above csv import.
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    // Lasso functions
   
  
  var lasso_start = function() {
    lasso.items()
        .attr("r",3.5) // reset size
        .classed("not_possible",true)
        .classed("selected",false);
  };

  var lasso_draw = function() {
    // Style the possible dots
    lasso.items().filter(function(d) {return d.possible===true})
    .classed({"not_possible":false,"possible":true});

  // Style the not possible dot
    lasso.items().filter(function(d) {return d.possible===false})
    .classed({"not_possible":true,"possible":false});
};

  var lasso_end = function() {
      // Reset the color of all dots
      lasso.items()
          .classed("not_possible",false)
          .classed("possible",false);

      // Style the selected dots
      var selected = lasso.selectedItems()
      .classed("selected",true)
      .attr("r",7);

      // var selected = lasso.items().filter(function(d) {return d.selected===true});

      selectedDots = selected["_groups"][0].slice()
      console.log(selectedDots)
      selectedDots.forEach(function(data) {
      console.log(data)
      clusters.push(data["id"].slice(3))

      email_group.forEach(function(entry) {
        clusters.forEach(function(id) {
          if (entry.id == id) {
          email.push(entry.email)
          email_list.push(email.slice())
          }
        })
      })

      var button = d3.select("#email-btn");
      button.on("click", function() {
        email.forEach(function(user_email){
          d3.json("/send_email/"+user_email)
        }) 
        msgbox("emails sent")
        });
      });
      
      

      // Reset the style of the not selected dots
      lasso.notSelectedItems()
          .attr("r",3.5);

      }

  
  var lasso = d3.lasso()
      .closePathSelect(true)
      .closePathDistance(100)
      .items(circlesGroup)
      .targetArea(svg)
      .on("start",lasso_start)
      .on("draw",lasso_draw)
      .on("end",lasso_end);
  
  svg.call(lasso);


    // X Axis labels event listener.
    labelsGroup.selectAll("text")
        .on("click", function() {
        // Get value of selection.
          var value = d3.select(this).attr("value");
          console.log(value)

        //if select x axises
              if (value === "visitNumber" || value === "totals_hits" || value === "totals_pageviews") {
                // Replaces chosenXAxis with value.
                chosenXAxis = value;

                // Update x scale for new data.
                xLinearScale = xScale(nonzeroData, chosenXAxis);

                // Updates x axis with transition.
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Update circles with new x values.
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // Update circles text with new values.
                circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // Changes classes to change bold text.
                if (chosenXAxis === "totals_pageviews") {
                    pageviewsLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    vistornumberLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    
                    hitsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "visitNumber"){
                    pageviewsLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    vistornumberLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    hitsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    pageviewsLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    vistornumberLabel
                        .classed("active", false)
                        .classed("inactive", true)

                    hitsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }}
          });
    
    return svg.node();

        });

console.log(selectedDots)

console.log("!!!")
alert(email)




console.log(email_list[0])