//Open connection
var connection = new WebSocket("wss://z3fz92jyni.execute-api.us-east-1.amazonaws.com/dev_v1");
var metricsObject = {
    action: "sendMessage",
    data: "PM_Metrics"
};
var metrics;
connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));
    /*
    Downloading Data
     */
    // Performance Metrics
    connection.send(JSON.stringify(metricsObject));
    connection.onmessage = function (msg) {
        metrics = JSON.parse(msg.data);
        console.log(metrics);
    };
    console.log("Message sent: " + JSON.stringify(metricsObject));
    // Latest Performance Metrics
    var latestMetrics;
    var latestMetricsObject = {
        action: "getLatestData",
        data: "pm_metrics"
    };
    connection.send(JSON.stringify(latestMetricsObject));
    connection.onmessage = function (msg) {
        latestMetrics = JSON.parse(msg.data);
        console.log(latestMetrics);
    };
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
//# sourceMappingURL=websocket.js.map