// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // get the info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demo panel
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Creating function for plots
function getPlot(id) {
    // getting data from the json file
    d3.json("samples.json").then((data)=> {
        console.log(data)
  
           
        // filter by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
    
  
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
 
        // create trace
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(255,0,153)'},
            type:"bar",
            orientation: "h",
        };
  
        
        var data = [trace];
  
        // layout
        var layout = {
            title: "Top 10 OTUs",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // finish up the plot
        Plotly.newPlot("bar", data, layout);

    // Bubble
    var trace1 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids,
            colorscale: "Picnic"
        },
        text: samples.otu_labels

    };

    // set the layout for the bubble plot
    var layout_b = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
    };

    // creating data variable 
    var data1 = [trace1];

    // create the bubble plot
    Plotly.newPlot("bubble", data1, layout_b); 
        
      });
  }  


// Initializes the page with a default plot
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}


init();