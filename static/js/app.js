


function initialize(){

    var dropdown = d3.select("#selDataset");
  
  
    d3.json("../samples.json").then((data) => {
    //console.log(data);
  
    //append values to dropdown button
    data.names.forEach(function(name){
      dropdown.append("option").text(name).property("value");})
  
    var id =data.names[0];
  
    
    updatePlot(id);
    metadata(id);
  
    
    
    }
  )}

function updatePlot() {
    /* data route */
  var url = "/api/filtered_data";
  d3.json(url).then(function(response) {

    console.log(response);

    var temp_data = response;
    var tranctions= temp_data.map(data=> data.tranctions);
    var date = temp_data.map(data=> data.date);

    // var trace1 = {
    //     x:date,
    //     y:tranctions,
    //     type: 'scatter'
    //   };

    var trace1 = {
        x:[1,2,3],
        y:[2,3,4],
        type: 'scatter'
      };
    
    var data = trace1;

    Plotly.newPlot("line", data, layout);
  });
}

initialize();
updatePlot();
