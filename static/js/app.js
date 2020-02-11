function initializePlot(data) {
    var temp_data=data;
    var temp_data_key=[];

    //get all cat keys
    Object.keys(temp_data).forEach((k,i) => 
    temp_data_key.push(k));

    //convert objects to arrays
    var transactions= Object.keys(temp_data.total_transactions).map(i => temp_data.total_transactions[i]);
    var date = Object.keys(temp_data.date).map(i => temp_data.date[i]);

    console.log(transactions);
    console.log(date);

    //change datetime format for the plotly
    for (i=0;i < date.length;i++){
        date[i]=date[i].toString().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    }

    //line chart
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
        xaxis: { title: "Date" },
        yaxis: { title: "Transactions"}
      
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

function updatePlot(StartDate,EndDate){
    d3.json("/api/filtered_data/" + StartDate + "/" + EndDate).then(function(response) {
    var data = response;
    console.log(data);
    })
}

initializePlot(data);

//ajax approach with 400 error bad request 
/*
$(function() {
  $('button').click(function() {
      $.ajax({
          url: '/api/filtered_data/<string:startdate>/<string:enddate>',
          data: $('form').serialize(),
          type: 'POST',
          success: function(response) {
              console.log(response);
          },
          error: function(error) {
              console.log(error);
          }
      });
  });
});
*/


var button = d3.select("#filter-btn");
button.on("click", function() {
  // Select the start&end date 
  var inputStartDate = d3.select("#datetime1");
  var inputEndDate=d3.select("#datetime2");

  // Get the value property of the input element
  var StartDate = inputStartDate.property("value");
  var EndDate = inputEndDate.property("value");

  //to detect if there is a input to filter
  if (StartDate != '' && EndDate !=''){
    //apply the change to the variable in the query script
    //pass to function updateplot
    console.log('-----------------')
    console.log(StartDate);
    console.log(EndDate);
    updatePlot(StartDate,EndDate);

  } 
  else {
    var filteredData = data;
    console.log("missing input value")
  }
  }
)

