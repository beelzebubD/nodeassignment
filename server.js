var http = require('http');
var app = require('./app');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "tuy8t6uuvh43khkk.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "kdlfflhaz60phgvg",
  password: "irgbstk2n1jq8lpg"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected! server.js");
  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
    console.log("Database mydb");
  });
});
var port = process.env.PORT || 3306;
http.createServer(app.handleRequest).listen(port,function(){
	console.log("APP is running on port"+port);
});