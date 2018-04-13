var http = require('http');
var app = require('./app');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9044"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected! server.js");
  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
    console.log("Database mydb");
  });
});
http.createServer(app.handleRequest).listen(process.env.PORT || 8000);
