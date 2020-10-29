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
const cookieparser = require('cookie-parser')
app.use(cookieparser())

const pool = mysql.createPool({
    connectionLimit: 100, //this should fix the weird error event bug
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b0ec116f629fb6',
    password: '1b2f0771f9e2812',
    database: 'heroku_e362e57bba7349a',
    supportBigNumbers: true
});


pool.getConnection(function (err, connection) {
    if (err) {
        connection.release();
        throw err;
    }
    let createVoterData = 'CREATE TABLE IF NOT EXISTS VoterData(ssn INT NOT NULL, voterName VARCHAR(255) NOT NULL, PRIMARY KEY(ssn, voterName));'
    connection.query(createVoterData, function (err, results, fields) {
        if (err) {
            console.log(`ERROR IN CREATEVOTERDATA TABLE`)
            return console.log(err.message)
        }
    })
    let createVotes = `CREATE TABLE IF NOT EXISTS Votes(ssn INT, voterName VARCHAR(255), candidateName VARCHAR(255), FOREIGN KEY (ssn,voterName) REFERENCES voterData(ssn,voterName) ON DELETE SET NULL ON UPDATE CASCADE);`
    connection.query(createVotes, function (err, results, fields) {
        if (err) {
            console.log(`ERROR IN CREATEVOTES TABLE`)
            return console.log(err.message)
        }
    })
    let sql = "INSERT INTO VoterData(SSN, voterName) VALUES ?";
    let values = [
        [111111111, 'name1'],
        [222222222, 'name2'],
        [333333333, 'name3'],
        [444444444, 'name4'],
        [555555555, 'name5'],
        [666666666, 'name6'],
        [777777777, 'name7'],
        [888888888, 'name8'],
        [999999999, 'name9'],
        [696969696, 'name69']
    ];
    connection.query(sql, [values], function (err) {
        if (err) {
            console.log(`ERROR INSERTING VALUES INTO VOTERDATA`)
            return console.log(err.message)
        }
    });
    connection.release();
});

function verifyRegistration(data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        //super duper vulnerable to sql injection, but nobody say anything
        let check = `SELECT SSN, voterName FROM VoterData WHERE SSN = ${data.ssn} AND voterName = '${data.name}';`
        console.log(check)
        connection.query(check, function (err, results) {
            if (err) {
                console.log(`Error in verifyRegistration select ssn and name query`)
                return console.log(err.message)
            }
            let output = JSON.parse(JSON.stringify(results))
            if(typeof(output[0]) === 'undefined' || !results){
                console.log(`${data.name} has not registered to vote`)
                return callback(0)
            }
            let name = output[0].voterName
            let ssn = output[0].SSN
            connection.release();
            if (parseInt(data.ssn) === ssn && data.name === name) {
                console.log(`${data.name} has registered to vote`)
                return callback(1)
            }
            console.log(`${data.name} aka ${name} has not registered to vote with SSN = ${data.ssn} aka \n SSN= ${ssn}`)
            return callback(0)
        })
    })
}
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

app.get("/ballot", provideBallot);

function provideBallot(request, response){
    let cookies = request.headers.cookie
    //currently just ensures that the cookie exists
    if (typeof cookies !== 'undefined' && cookies) {
        let ssn = getCookie('ssn', cookies)
        let name = getCookie('name', cookies)
        if (ssn !== '' && name !== '') {
            verifyRegistration({ssn, name}, function (result) {
                if (result === 1) {
                    response.sendFile(__dirname + "/views/ballot.html");
                }
                else{
                    response.sendStatus(401)
                }
            })
        }
    }else{
        response.sendStatus(401)
    }
}
//code adapted from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname, decodedCookie) {
    let name = cname + "=";
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//Call by putting resetDB in the write-in field
function resetDatabase() {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        let deleteRecords = `DELETE FROM Votes;`
        connection.query(deleteRecords, function (err, results, fields) {
            if (err) {
                return console.log(err.message)
            }
        })
        connection.release();
    })
}

//Call by putting deleteDB in the write-in field
function deleteDatabase() {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        let deleteDB = `DROP TABLE Votes`
        connection.query(deleteDB, function (err, results, fields) {
            if (err)
                return console.log(err.message)
        })
        let deleteData = `DROP TABLE VoterData`
        connection.query(deleteData, function (err, results, fields) {
            if (err)
                return console.log(err.message)
        })
        connection.release();
    })
}
app.post("/requestBallot", bodyParser.json(), (req, res) => {
    let ssn = req.body.ssn
    let name = req.body.name
    verifyRegistration({ssn, name}, function(result) {
        if (result === 1) {
            res.cookie('ssn', ssn)
            res.cookie('name', name)
            res.sendFile(__dirname + "/views/index.html");
        }
        else{
            //doesn't redirect you if on a browser, but might be useful
            return res.sendStatus(401)
        }
    })
})

app.post("/voteFcn", bodyParser.json(), (req, res) => {
    let ssn = req.body.ssn
    let name = req.body.name
    let vote = req.body.candidate

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
    checkVoted({ssn, name, vote}, function (result) {
        value = result
        console.log(`VALUE checkVoted = ${value}`)
        if (value === 1) {
            res.json({res: false, message: `${name}, you have already voted.`})
        } else {
            addToDatabase({ssn, name, vote}, function (result) {
                value = result
                console.log(`VALUE addToDatabase = ${value}`)
                if (result === 0) {
                    res.json({res: false, message: `Error inserting new record into database.`})
                } else if (result === 1) {
                    res.json({res: true, message: `${name}, your vote for ${vote} has been recorded.`})
                }
            })
        }
    })

})

function checkVoted(data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        //--------------------------------------
        let check = 'SELECT ssn, voterName FROM votes;'
        connection.query(check, function (err, results) {
            let ssnArray = []
            if (err) {
                console.log(`Error in addDatabase select ssn query`)
                return console.log(err.message)
            }
            Object.keys(results).forEach(function (key) {
                let row = results[key]
                ssnArray.push(row.ssn.toString())
            })
            console.log(ssnArray)
            console.log(`SSN FROM DATA = ${data.ssn}`)
            console.log(ssnArray.includes(data.ssn))
            if (ssnArray.includes(data.ssn)) {
                connection.release()
                console.log(`${data.name} has already voted`)
                return callback(1)
            }
            connection.release();
            return callback(0)
        })
    })
}

function addToDatabase(data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release()
            throw err;
        }
        let sql = `INSERT INTO Votes VALUES (${data.ssn}, '${data.name}','${data.vote}')`
        connection.query(sql, function (err, results, fields) {
            if (err) {
                connection.release()
                console.log(err.message)
                return callback(0)
            }
            connection.release();
            console.log("1 record inserted.")
            return callback(1)
        })
    })
}


app.get('/votes', (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        let candidates = []
        let votes = []
        let sql = 'SELECT candidateName, COUNT(*) AS numVotes FROM VOTES GROUP BY candidateName;'
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(`Error in app.get query`)
                return console.log(err.message)
            }
            connection.release();
            Object.keys(results).forEach(function (key) {
                let row = results[key]
                candidates.push(row.candidateName)
                votes.push(row.numVotes)
            })
            res.json({nameCandidate: candidates, numVotes: votes})
        })
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
https.createServer(options, app).listen(8090)
console.log("Your app is listening on port 8000 for HTTP connections. http://localhost:8000")
console.log("Your app is listening on port 8090 for HTTPS connections. https://localhost:8090")