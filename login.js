const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "a",
    database: "nodelogin"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("Successfully connected to the database!")
});

app.get("/",function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/",encoder, function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let cpm = req.body.cpm;
    let meantime = req.body.meantime;
    let margin = 300;
    console.log(username)
    console.log(cpm);
    console.log(meantime);
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username,password],function(error,results,fields){
        if (error) throw error;
        if (results.length > 0) {
            let data = JSON.parse(JSON.stringify(results))
            console.log(data[0].mean);
            let baseMean = data[0].mean;
            if (meantime <= baseMean + margin && meantime >= baseMean - margin){
            console.log(username + ": login successfully");
            res.redirect("/welcome");
            }
            else{
                res.redirect("/forbidden");
            }
        } else {
            res.redirect("/");
        } 
        res.end();
    })

    
})

// when login is success
app.get("/welcome", function(req,res){
    res.sendFile(__dirname + "/welcome.html");
})

// When the login fails
app.get("/forbidden", function(req,res){
    res.sendFile(__dirname + "/forbidden.html");
})


app.get("/index", function(req,res){
    res.sendFile(__dirname + "/index.html");
})
// set app port
app.listen(3000);
