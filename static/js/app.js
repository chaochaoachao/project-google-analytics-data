
function updatePlot(data) {

    var temp_data=data;
    var temp_data_key=[];

    //get all cat keys
    Object.keys(temp_data).forEach((k,i) => 
    temp_data_key.push(k));
    //console.log(temp_data_key);

    //convert objects to arrays
    var transactions= Object.keys(temp_data.total_transactions).map(i => temp_data.total_transactions[i]);
    var date = Object.keys(temp_data.date).map(i => temp_data.date[i]);

    console.log(transactions);
    console.log(date);

    //change datetime format for the plotly
    for (i=0;i < date.length;i++){
        date[i]=date[i].toString().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    }

    //console.log(transactions);
    console.log(date);

    //for (i = 0; i < temp_data_key.length; i++) {
    //var cat=temp_data_key[i]
    //console.log(cat)
    //console.log(Object.values(temp_data.cat))
    
    // var trace1 = {
    //     x:date,
    //     y:transactions,
    //     type: 'scatter'
    //  };

    var trace1 = [
        {
          x: date,
          y: transactions,
          type: 'scatter'
        }
      ];
      
    var data = trace1;

    var layout = {
        title: 'Basic Time Series',
      };

    Plotly.newPlot("line", data, layout);
  
}

    
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

updatePlot(data);
