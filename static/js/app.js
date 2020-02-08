function updatePlot() {
    /* data route */
  var url = "/api/filtered_data";
  d3.json(url).then(function(response) {

    console.log(response);

    var temp_data = response;
    var tranctions= temp_data.map(data=> data.tranctions);
    var date = temp_data.map(data=> data.date);

    var trace1 = {
        x:date,
        y:tranctions,
        type: 'scatter'
      };
    
    var data = trace1;

    Plotly.newPlot("line", data, layout);
  });
}

updatePlot();
