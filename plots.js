function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var wfreq=Object.values(result)[6];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html('');
        Object.entries(result).forEach(([key,value]) => PANEL.append("h6").text(key+": "+value));
        // Gauge
        var data = [
            {
              type: "indicator",
              mode: "number+gauge",
              gauge: { axis: { range: [null, 10] }},
              value: wfreq,
              domain: { x: [0, 1], y: [0, 1] },
              title: {text: "Belly Button Washing Frequency<br>scrubs per week" }
            }
          ];
        Plotly.newPlot("gauge",data);
    }
    );
}
buildMetadata(940);
function buildCharts(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var otu_ids = Object.values(result)[1];
        var otu_otu_ids = otu_ids.map(otu => "otu "+ otu);
        var sample_values = Object.values(result)[2];
        var otu_labels = Object.values(result)[3];
        var topTenId = otu_otu_ids.slice(0,10);
        var topTenValue = sample_values.slice(0,10);
        var topTenLabel = otu_labels.slice(0,10);
        // Bar Graph
        var data1 = {
            x: topTenValue.reverse(),
            y: topTenId.reverse(),
            text: topTenLabel.reverse(),
            type: "bar",
            orientation: "h"};
        var layout = {
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              },
              title: {text: "Top 10 Bacterial Species (OTUs)"}
        };
        // Bubble Chart
        var data2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'YlGnBu'
            }
        }
        var layout2 = {
            title: "Frequency of all the bacterial species",
            xaxis: { title: "OTU ID"}}

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", [data1],layout);
        // Bubble Chart
        Plotly.newPlot("bubble",[data2],layout2)

    }
    );
}
buildCharts(940);
