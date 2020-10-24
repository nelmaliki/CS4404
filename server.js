'use strict' //Prevents use of undeclared variables
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

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

app.get("/vote", (req, res) => {
    //TODO: Ensure voter only votes once. (IP checks?)
   //Get voter name
    let name = req.body.name
    if(/^[A-Za-z0-9]+$/.test(name)) {
        alert("Invalid input. Name can only contain A-Z, a-z, or 0-9.")
        return;
    }
    //get vote
    let vote = req.body.voteData
    if(vote === 'writein') vote = req.body.writein;
    if(/^[A-Za-z0-9]+$/.test(vote)) {
        alert("Invalid input. Write in cannot contain symbols.")
        return;
    }
    //TODO: Query database to insert new record
    console.log(`Received vote from "${name}" for "${vote}".`)
    res.send(`${name}, your vote for ${vote} has been recorded.`)
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
