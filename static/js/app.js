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
    
}
    
    //     console.log('hello')
    //     var temp_data = response;
    //     console.log(temp_data)
    //     //var bounces= temp_data.bounces(data=>data.)
    //     //var date = temp_data[1]

    //     var bounces = [];

    //     // Iterate through each recipe object
    //     temp_data.bounces.forEach((bounce) => {
    //     // Iterate through each key and value
    //     Object.entries(bounce).forEach(([key,value]) => {
    //         bounces.push(value);
        
    //     });
    //     console.log(bounces)
    //     });
        

        
    //     // var trace1 = {
    //     //     x:date,
    //     //     y:tranctions,
    //     //     type: 'scatter'
    //     //   };

    //     var trace1 = {
    //         x:[1,2,3],
    //         y:[2,3,4],
    //         type: 'scatter'
    //     };
        
    //     var data = trace1;

    //     Plotly.newPlot("line", data, layout);
    // });
//})}

//initialize();
updatePlot();
