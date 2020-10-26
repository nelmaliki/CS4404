'use strict' //Prevents use of undeclared variables
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express")
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')

const connection = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b0ec116f629fb6',
    password: '1b2f0771f9e2812',
    database: 'heroku_e362e57bba7349a'
})

connection.connect(function (err) {
    if (err)
        return console.error('error ' + err.message)
    let createVotes = `CREATE TABLE IF NOT EXISTS Votes(SSN INTEGER(255),voterName VARCHAR(255) NOT NULL, candidateName VARCHAR(255) NOT NULL, PRIMARY KEY(SSN))`
    connection.query(createVotes, function (err, results, fields) {
        if (err) {
            console.log(err.message)
        }
    })
})


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

//Call by putting resetDB in the write-in field
function resetDatabase() {
    let deleteRecords = `DELETE FROM Votes;`
    connection.query(deleteRecords, function (err, results, fields) {
        if (err) {
            return console.log(err.message)
        }
    })
}

//Call by putting deleteDB in the write-in field
function deleteDatabase() {
    let deleteDB = `DROP TABLE Votes`
    connection.query(deleteDB, function (err, results, fields) {
        if (err) {
            return console.log(err.message)
        }
    })
}

app.post("/voteFcn", bodyParser.json(), (req, res) => {
    console.log(req.body)
    let ssn = req.body.ssn
    let name = req.body.name
    let vote = req.body.candidate
    /*console.log('SSN = ' + ssn)
    console.log('NAME = ' + name)
    console.log('VOTE = ' + vote)*/

    //Quick and dirty way to reset/delete the database on the fly. NOTE: REMOVE BEFORE DEPLOYMENT
    if (vote === 'resetDB') {
        resetDatabase()
        res.json({res: false, message: `Reset database.`})
        return console.log(`Reset database!`)
    }
    if (vote === 'deleteDB') {
        deleteDatabase()
        res.json({res: false, message: `Deleted database, please restart the server.`})
        return console.log('Deleted database, please restart server.')
    }
    let value = 0
    addToDatabase({ssn,name,vote},function(result) {
        value = result
        console.log(`VALUE = ${value}`)
        if (value) {
            console.log("addToDatabase returned true.")

            res.json({res: true, message: `${name}, your vote for ${vote} has been recorded.`})
        } else {
            console.log("addToDatabase returned false.")
            res.json({res: false, message: `${name}, you have already voted.`})
        }
    })
});

function addToDatabase(data, callback) {
    let sql = `INSERT INTO Votes VALUES (${data.ssn}, '${data.name}','${data.vote}')`;
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.log(err.message)
            return callback(0)

        }
        console.log("1 record inserted.")
        return callback(1)
    })
}



app.get('/votes', (req, res) => {
    let candidates = []
    let votes = []
    let sql = `SELECT candidateName, COUNT(*) AS numVotes FROM VOTES GROUP BY candidateName`
    connection.query(sql, function (err, results) {
        if (err) {
            console.log(`Error in app.get query`)
            return console.log(err.message)
        }
        Object.keys(results).forEach(function (key) {
            var row = results[key]
            candidates.push(row.candidateName)
            votes.push(row.numVotes)
        })
        res.json({nameCandidate: candidates, numVotes: votes})
    })
})

// listen for requests :)
/*const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});*/

const options = {
    key: fs.readFileSync("./certificates/key.pem"),
    cert: fs.readFileSync("./certificates/cert.pem")
}

//Listen on http
app.listen(8000)
//Listen on https. The domain is https://localhost:8080
https.createServer(options,app).listen(8080)
console.log("Your app is listening on port 8000 for HTTP connections. http://localhost:8000")
console.log("Your app is listening on port 8080 for HTTPS connections. https://localhost:8080")