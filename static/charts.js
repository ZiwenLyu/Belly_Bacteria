function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = sampleArray.filter(result => result.id === sample);
    console.log(filteredArray)
    //  5. Create a variable that holds the first sample in the array.
    var getResult = filteredArray[0];
    console.log(getResult)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = getResult.otu_ids
    var otuLabels = getResult.otu_labels
    var otuValues = getResult.sample_values
    console.log(otuID)
    console.log(otuLabels)
    console.log(otuValues)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0,10).map(eachID => 'otu' + eachID).reverse()
    console.log(yticks)
    var top10Values = otuValues.slice(0,10).reverse()
    console.log(top10Values)
    var top10Lables = otuLabels.slice(0,10).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: top10Values,
      type: "bar",
      orientation: "h",
      text: top10Lables
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
  // Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
     y: otuID,
     x: otuValues,
     text: otuLabels,
     mode: "markers",
     marker:{
       size: otuValues,
       color: otuID
     }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // Create a Gauge
    // 3. Create a variable that holds the washing frequency.
    var metaData = data.metadata
    var metaResultArrary = metaData.filter(metaResult => metaResult.id == sample)
    console.log(metaResultArrary)
    var firstResult = metaResultArrary[0]
    console.log(firstResult)
    var washFreq = firstResult.wfreq
    console.log(washFreq)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,1], y:[0,1]},
      value: washFreq,
      title: {text: "scrubs per week"},
      type: "indicator",
      mode: "gauge+number",
      ticker: { showticker: true },
      gauge:{
        axis:{range:[null,10.0]},
        steps: [
          {range:[0.0,2.0], color: "blue"},
          {range:[2.0,4.0], color: "lightblue"},
          {range:[4.0,6.0], color: "lightyellow"},
          {range:[6.0,8.0], color: "lightgreen"},
          {range:[8.0,10.0], color: "green"},
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
