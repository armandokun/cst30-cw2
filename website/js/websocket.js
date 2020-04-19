"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Open connection
exports.connection = new WebSocket("wss://z3fz92jyni.execute-api.us-east-1.amazonaws.com/dev_v1");
exports.connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));
    /*
    Downloading Data

    sendMessage:PM_Metrics to download all metrics
    sendMessage:Sentiment_Analysis to download twitter sentiment
    sendMessage:whatever to send other messages

     */
    // Twitter Sentimental Analysis Results
    var sentimentalObject = {
        action: "sendMessage",
        data: "Sentiment_Analysis"
    };
    exports.connection.send(JSON.stringify(sentimentalObject));
    console.log('Message sent: ' + JSON.stringify(sentimentalObject));
    exports.connection.onmessage = function (sentiment) {
        console.log(JSON.parse(sentiment.data));
    };
    // Latest Performance Metrics
    var latestMetrics;
    var latestMetricsObject = {
        action: "getLatestData",
        data: "pm_metrics"
    };
    exports.connection.send(JSON.stringify(latestMetricsObject));
    console.log("Message sent: " + JSON.stringify(latestMetricsObject));
    exports.connection.onmessage = function (msg) {
        try {
            latestMetrics = JSON.parse(msg.data);
            console.log(latestMetrics);
            // Wrapping Up Data for Plotly and display it on front console
            var plotlyData = getMetricsData(latestMetrics);
            // Replace text with the response from the server
            if (plotlyData !== undefined) {
                document.getElementById("messages").innerText = JSON.stringify(plotlyData);
            }
            else {
                document.getElementById("messages").innerText = "No headset connected";
            }
        }
        catch (e) {
            console.log(e);
        }
    };
};
//Log errors
exports.connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error));
};
function getMetricsData(metrics) {
    var metricsData = [];
    try {
        //Names of metrics, store x and y values
        metrics.forEach(function (metric) {
            var dateStamp = parseInt(metric.PointTimeStamp.N);
            var myDate = new Date(dateStamp * 1000);
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
    catch (e) {
        console.log("Response to PM_Metrics: " + "No headset connected");
    }
}
//# sourceMappingURL=websocket.js.map