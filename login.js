const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const fs = require('fs');
let file = './pass.txt';
let readFile

//read typing pattern
fs.readFile(file, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    //console.log(data)
    readFile = data
})

//console.log(typeof readFile);
function stringInt (x){
    let arr = [];
    for (var i = 0; i < x.length; i++){
        arr.push(parseInt(x[i]));
    }
    return arr;
}

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
    let margin = 100;
    let list = req.body.arr;
    let go = 0;
    //console.log(username)
    //console.log(cpm);
    //console.log(meantime);
    //console.log(list);
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username,password],function(error,results,fields){
        if (error) throw error;
        //check username and password
        if (results.length > 0) {
            let data = JSON.stringify(results)
            let arr = list.split(",")
            let arr2 = readFile.split(",")
            arr.shift()
            //console.log(arr);
            arr = stringInt(arr);
            //console.log(arr);
            arr2 = stringInt(arr2);
            //console.log(arr2);
            for (let i = 0; i < arr.length ; i++){
                //console.log("arr: "+arr[i]);
                //console.log("arr2: "+arr2[i]);
                //console.log(margin);
                //console.log(arr2[i] + margin);
                if(arr[i] <= arr2[i] + margin && arr[i] >= arr2[i] - margin){
                    console.log("pass");
                    go+=1;
                }else{
                    go = 0;
                }
            }
            if (go == arr2.length){ // meantime <= baseMean + margin && meantime >= baseMean - margin
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
