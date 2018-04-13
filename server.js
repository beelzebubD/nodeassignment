var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9044"
});

function onRequest(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./createusername.html', null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}

http.createServer(onRequest).listen(8000);