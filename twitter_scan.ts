//Module that reads keys from .env file
const dotenv = require('dotenv');

//Node Twitter library
const Twitter = require('twitter');

//Copy variables in file into environment variables
dotenv.config();

import {saveData} from "./database_function";

//Set up the Twitter client with the credentials
let client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

//Downloads and outputs tweet text
async function scanTimeline() {
    try {
        //Set up parameters for the scan
        let queryParams = {
            count: 50,
            trim_user: true,
            exclude_replies: true,
        };

        //Wait for scan to execute asynchronously
        let result = await client.get('statuses/home_timeline', queryParams);

        //Output the result
        result.forEach(tweet => {
            console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text);
        });
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

//Call function to scan the user's timeline
// scanTimeline();

//Function downloads and outputs tweet text
async function storeTweets() {
    try {
        //Set up parameters for the scan
        let queryParams = {
            count: 50,
            trim_user: true,
            exclude_replies: true,
        };

        //Wait for scan to execute asynchronously
        let twitterResult = await client.get('statuses/home_timeline', queryParams);

        //Output the result
        let promiseArray: Array<Promise<string>> = [];
        twitterResult.forEach((tweet) => {
            console.log("Tweet id: " + tweet.id + ". Created At: " + tweet.created_at + ". Tweet text: " + tweet.text);

            //Store save data promise in array
            promiseArray.push(saveData(tweet.id, tweet.created_at, tweet.text));
        });

        //Execute all of the save data promises
        let databaseResult: Array<string> = await Promise.all(promiseArray);
        console.log("Database result: " + JSON.stringify(databaseResult));
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

//Call function to scan for tweets
storeTweets();
