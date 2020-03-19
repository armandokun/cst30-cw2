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
async function searchTweets(keyword: string) {
    try {
        //Set up parameters for the search
        let searchParams = {
            q: keyword,
            count: 10,
            lang: "en"
        };

        //Wait for search to execute asynchronously
        let result = await client.get('search/tweets', searchParams);
        console.log(JSON.stringify(result));

        //Output the result
        result.statuses.forEach(tweet => {
            console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text);
        });
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

//Call function to search for tweets with specified subject
// searchTweets("WestWorld");

//Function downloads and outputs tweet text
async function storeTweets(keyword: string) {
    try {
        //Set up parameters for the search
        let searchParams = {
            q: keyword,
            count: 10,
            lang: "en"
        };

        //Wait for search to execute asynchronously
        let twitterResult = await client.get('search/tweets', searchParams);

        //Output the result
        let promiseArray: Array<Promise<string>> = [];
        twitterResult.statuses.forEach((tweet) => {
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

//Call function to search for tweets with specified subject
storeTweets("WestWorld");
