//Prices update every 10 seconds
let timeInterval = 10000;

//Number of data points to generate
let numTimeIntervals = 6;

//Add dummy data for four currencies
function getCurrencyData(){

    //Create Date class so we can obtain a starting timestamp
    let date = new Date();

    //Starting point for generation of data
    let startTimestamp = date.getTime();

    //Names of currencies, their average prices and arrays to store the generated x and y values
    let currencyData = [
        {name: "bitcoin", averagePrice: 50, x: [], y: []},
        {name: "ethereum", averagePrice: 50, x: [], y: []},
        {name: "litecoin", averagePrice: 50, x: [], y: []},
        {name: "tron", averagePrice: 50, x: [], y: []}
    ];

    for (let ts = 0; ts < numTimeIntervals * timeInterval; ts += timeInterval) {
        //Add random data for each of the currencies to the database
        currencyData.forEach(currency => {

            //Add time stamp to currency x array
            let date = new Date(startTimestamp + ts);
            currency.x.push(date);

            //Add price to currency y array
            currency.y.push(currency.averagePrice * (1 + 0.1 * (Math.random() - 0.5)));
        });
    }

    //Remove average price property - we only needed it to generate data
    currencyData.forEach(currency => {
        delete currency.averagePrice;
    });

    //Log final result and return
    //console.log(currencyData);
    return currencyData;
}

