
//Open connection
const connection = new WebSocket(
    "wss://z3fz92jyni.execute-api.us-east-1.amazonaws.com/dev_v1"
);

const metricsObject: object = {
    action: "sendMessage",
    data: "PM_Metrics"
};

let metrics: object[];

connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));

    /*
    Downloading Data
     */


    // Latest Performance Metrics
    let latestMetrics: object[];

    const latestMetricsObject: object = {
        action: "getLatestData",
        data: "pm_metrics"
    };

    connection.send(JSON.stringify(latestMetricsObject));
    console.log("Message sent: " + JSON.stringify(latestMetricsObject));

    connection.onmessage = function (msg) {
        latestMetrics = JSON.parse(msg.data);
        console.log(latestMetrics);

        /*
        Wrapping Up Data for Plotly
        */

        let plotlyData = getMetricsData(latestMetrics);

        document.getElementById("messages").innerText = JSON.stringify(plotlyData);


        // Twitter Sentimental Analysis Results
        // const sentimentalObject: object = {
        //     action: "sendMessage",
        //     data: "Sentiment_Analysis"
        // };
        //
        // connection.send(JSON.stringify(sentimentalObject));
        // connection.onmessage = function (sentiment) {
        //
        //     //Generates the specified number of random sentiment data
        //     function getDemoSentimentData(numItems){
        //         let sentimentArray = [];
        //
        //         for(let i=0; i<numItems; i++){
        //             //Randomly generate sentiment
        //             let positiveSentiment = Math.random();
        //             let negativeSentiment = 1-positiveSentiment;
        //
        //             //Add sentiment object to array
        //             let sentimentObject = {
        //                 Sentiment: "UNDEFINED",
        //                 SentimentScore: {
        //                     Positive: positiveSentiment,
        //                     Negative: negativeSentiment,
        //                     Neutral: 0,
        //                     Mixed: 0
        //                 }
        //             }
        //             sentimentArray.push(sentimentObject);
        //         }
        //
        //         //Return random sentiment data
        //         return sentimentArray;
        //     }
        //}

    };
};

//Send message to server
function sendMessage() {
    var msgText = document.forms[0].inputString.value;

    //Create message to be sent to server
    var msgObject = {
        action: "sendMessage",
        data: msgText
    };

    //Send message object
    connection.send(JSON.stringify(msgObject));

    //Log result
    console.log("Message sent: " + JSON.stringify(msgObject));
}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error));
};

//Add dummy data for four currencies
function getMetricsData(metrics) {

    let metricsData: object[] = [];

    //Names of currencies, their average prices and arrays to store the generated x and y values
    metrics.forEach(metric => {
        let dateStamp = parseInt(metric.PointTimeStamp.N);
        let myDate = new Date( dateStamp * 1000);
        myDate.toDateString();

        metricsData.push({
            name: metric.Metric.S,
            x: [myDate],
            y: [parseFloat(metric.Value.N) * 100]
        });
    });

    // Return final result
    return metricsData;
}
