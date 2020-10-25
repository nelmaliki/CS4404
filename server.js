'use strict' //Prevents use of undeclared variables
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express")
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')

const connection = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b0ec116f629fb6',
    password: '1b2f0771f9e2812',
    database: 'heroku_e362e57bba7349a'
})

connection.connect(function(err) {
    if(err)
        return console.error('error '+err.message)
    let createVotes = `CREATE TABLE IF NOT EXISTS Votes(voterName VARCHAR(255) NOT NULL, candidateName VARCHAR(255) NOT NULL, PRIMARY KEY(voterName))`
    connection.query(createVotes,function (err, results, fields) {
        if(err) {
            console.log(err.message)
        }
    })
    connection.end(function(err) {
        if(err) {
            return console.log(err.message)
        }
    })
})

//TODO: Write code here that creates schema if it does not exist in the database


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


function resetDatabase() {
    //TODO: Fill in method once we know how to connect to the database. Simply run SQL commands to clear the database.
}

app.post("/voteFcn", bodyParser.json(), (req, res) => {
    //TODO: Ensure voter only votes once. (IP checks?)
    console.log(req.body.toString())
    //test db connection
    connection.connect()
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });
    let name = req.body.name
    let vote = req.body.candidate
    console.log('NAME = '+name)
    console.log('VOTE = '+vote)
    //Quick and dirty way to reset the database on the fly. NOTE: REMOVE BEFORE DEPLOYMENT
    if(vote==='resetDB') {
        resetDatabase();
        console.log(`Reset database!`)
    }
    //TODO: Query database to insert new record, res.json a false and new message if the data does not get entered into the database
    console.log(`Received vote from "${name}" for "${vote}".`)
    res.json({res:true,message:`${name}, your vote for ${vote} has been recorded.`})
});


let votes = [3,10,4]
let candidates = ["Nike", "Skechers", "Timbs"]
app.get('/votes',(req,res)=>{
    //TODO: Query from database, put results into array below.
    res.json({nameCandidate:candidates, numVotes:votes})
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
