'use strict' //Prevents use of undeclared variables
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const alert = require('alert')
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
/*app.get("/dreams", (request, response) => {
    // express helps us take JS objects and send them as JSON
    response.json(dreams);
});*/

//TODO: Connect to database

function resetDatabase() {
    //TODO: Fill in method once we know how to connect to the database. Simply run SQL commands to clear the database.
}

app.get("/voteFcn", (req, res) => {
    //TODO: Ensure voter only votes once. (IP checks?)
   //Get voter name
    console.log(req.query)
    let name = req.query.name
    let nameRegex = /^([A-Z][a-z][0-9][ -]){2,20}/
    if(nameRegex.test(name)) {
        alert("Invalid input. Name can only contain A-Z, a-z, 0-9, and spaces/hyphens.")
        return;
    }
    //get vote
    let vote = req.query.vote
    if(vote === 'writein'){
        vote = req.query.writein;
    }
    if(nameRegex.test(vote) || vote==='') {
        alert("Invalid input. Write can only contain A-Z, a-z, 0-9, and spaces/hyphens.")
        return;
    }
    //Quick and dirty way to reset the database on the fly. NOTE: REMOVE BEFORE DEPLOYMENT
    if(vote==='resetDB') {
        resetDatabase();
        console.log(`Reset database!`)
        alert("Reset database, please reload the page.")
    }
    //TODO: Function to reset database if write-in = resetDB
    //TODO: Query database to insert new record
    console.log(`Received vote from "${name}" for "${vote}".`)
    res.send(`${name}, your vote for ${vote} has been recorded.`)
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
