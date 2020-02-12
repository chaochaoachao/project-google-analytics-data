function initializePlot(data) {
    var temp_data=data;
    var temp_data_key=[];

    //get all cat keys
    Object.keys(temp_data).forEach((k,i) => 
    temp_data_key.push(k));

    //convert objects to arrays
    var transactions= Object.keys(temp_data.total_transactions).map(i => temp_data.total_transactions[i]);
    var date = Object.keys(temp_data.date).map(i => temp_data.date[i]);

    //console.log(transactions);
    //console.log(date);

    //change datetime format for the plotly
    for (i=0;i < date.length;i++){
        date[i]=date[i].toString().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    }
    Plot(date,transactions)
}

function Plot(date,transactions){
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

function GEO_Plot(Country_name,COUNTRY_count){
  var data = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: Country_name,
    z: COUNTRY_count,
    text: Country_name,
    autocolorscale: true
}];

var layout = {
  title: 'Basic ChOropleth Map',
  geo: {
      projection: {
          type: 'robinson'
      }
  }
};
Plotly.newPlot("geomap", data, layout, {showLink: false});
}

function updatePlot(StartDate,EndDate){
    d3.json("/api/filtered_data/" + StartDate + "/" + EndDate).then(function(response) {
    var new_data = response;
    //console.log("here",new_data);
    new_date=[]
    new_transactions=[]
    new_Country_name = []
    new_COUNTRY_count = []
    var data_array= Object.keys(new_data.data).map(i => new_data.data[i]);
    var geo_data_array= Object.keys(new_data.geodata).map(i => new_data.geodata[i]);
    //var date = Object.keys(new_data.data.date).map(i => new_data.data.date[i]);
    console.log(data_array)
    console.log(geo_data_array)

    //console.log(transactions);
    //console.log(date);
    for (i=0;i<data_array.length;i++){
      new_date[i]=data_array[i].date.toString().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
      new_transactions[i]=data_array[i].total_transactions;
    }
    console.log(new_date)
    console.log(new_transactions)

    for (i=0;i<geo_data_array.length;i++){
      new_Country_name[i]=geo_data_array[i].Country_name;
      new_COUNTRY_count[i]=geo_data_array[i].COUNTRY_count;
    }
    console.log(new_Country_name)
    console.log(new_COUNTRY_count)

    //replot
    Plot(new_date,new_transactions)
    GEO_Plot(new_Country_name,new_COUNTRY_count)
    })
}

initializePlot(data);

//ajax approach return with 400 error bad request 
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

var selectDropdown = d3.select("#selDataset")

function addOptions(StartDate,EndDate) {
  d3.json("/api/filtered_data/" + StartDate + "/" + EndDate).then(function(response) {
    var countries = response;
      countries.countrydata.forEach((name) => {
          var appendOption = selectDropdown.append("option").text(name).attr('value', name)
      })
      selectDropdown.selectedIndex = 0
  })
}

addOptions(StartDate,EndDate)
