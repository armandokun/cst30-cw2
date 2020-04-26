//Open connection
const connection = new WebSocket(
    "wss://z3fz92jyni.execute-api.us-east-1.amazonaws.com/dev_v1"
);

connection.onopen = async function (event) {
    console.log("Connected: " + JSON.stringify(event));

    /*
    Downloading Data

    sendMessage:PM_Metrics to download all metrics
    sendMessage:Sentiment_Analysis to download twitter sentiment
    sendMessage:whatever to send other messages

     */

    setTimeout(sentimentAnalysis, 0);

    setTimeout(latestMetrics, 5000);

}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error));
};

// Retrieve sentiment analysis data
function sentimentAnalysis() {
    // Twitter Sentimental Analysis Results
    const sentimentalObject: object = {
        action: "sendMessage",
        data: "Sentiment_Analysis"
    };

    connection.send(JSON.stringify(sentimentalObject));
    console.log('Message sent: ' + JSON.stringify(sentimentalObject));

    connection.onmessage = function (sentiment) {
        // console.log(JSON.parse(sentiment.data));
        const sentimentData = JSON.parse(sentiment.data);
        // init variables to store the sentiment percentage count
        let neutralScore: number = 0;
        let mixedScore: number = 0;
        let positiveScore: number = 0;
        let negativeScore: number = 0;
        console.log(sentimentData);
        sentimentData.forEach(item => {
            switch (item.sentimental_value) {
                case 'NEUTRAL':
                    neutralScore++;
                    break;
                case 'MIXED':
                    mixedScore++;
                    break;
                case 'POSITIVE':
                    positiveScore++;
                    break;
                case 'NEGATIVE':
                    negativeScore++;
                    break;
                default:
                    console.log('UNKNOWN VALUE IN SENTIMENT DATA');
                    break;
            }
        });
        let sentimentObject = {
            neutral: neutralScore,
            mixed: mixedScore,
            positive: positiveScore,
            negative: negativeScore
        };

        document.getElementById("sentimentMessages").innerText = JSON.stringify(sentimentObject);
    };
}

// Get Latest Data from the Headset
function latestMetrics() {
    // Latest Performance Metrics
    let latestMetrics: object[];
    const latestMetricsObject: object = {
        action: "getLatestData",
        data: "pm_metrics"
    };

    connection.send(JSON.stringify(latestMetricsObject));
    console.log("Message sent: " + JSON.stringify(latestMetricsObject));
    connection.onmessage = function (msg) {

        try {
            latestMetrics = JSON.parse(msg.data);
            console.log(latestMetrics);

            // Wrapping Up Data for Plotly and display it on front console
            let plotlyData = getMetricsData(latestMetrics);

            // Replace text with the response from the server
            if (plotlyData !== undefined) {
                document.getElementById("messages").innerText = JSON.stringify(plotlyData);
            } else {
                document.getElementById("messages").innerText = "No headset connected";
            }
        } catch (e) {
            console.log(e);
            console.log("ERROR in latesetMetrics()");
        }
    };
}

// Wraps up for Plotly
function getMetricsData(metrics: any[]) {

    let metricsData: object[] = [];

    try {
        //Names of metrics, store x and y values
        metrics.forEach(metric => {
            let dateStamp = parseInt(metric.PointTimeStamp.N);
            let myDate = new Date(dateStamp * 1000);
            myDate.toDateString();

            metricsData.push({
                name: metric.Metric.S,
                x: [myDate],
                y: [parseFloat(metric.Value.N) * 100]
            });
        });

        // Return final result
        return metricsData;

    } catch (e) {
        console.log("Response to PM_Metrics: " + "No headset connected");
    }


}
