const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "",
    database: "login"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});

app.get("/",function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var cpm = req.body.cpm;
    var meantime = req.body.meantime;
    console.log(username)
    console.log(cpm);
    console.log(meantime);
    connection.query("select * from loginuser where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
        if (results.length > 0) {
            console.log(results);
            res.redirect("/welcome");
            console.log(results);
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


app.get("/index", function(req,res){
    res.sendFile(__dirname + "/index.html");
})
// set app port
app.listen(4000);
