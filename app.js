var url = require('url');
var fs = require('fs');
var post ;
var mysql = require('mysql');
var qs = require('querystring');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9044",
  database: "mydb"
}); 

function renderHTML(path, response) {
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}
function extract(request, response, option) {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
           var post = qs.parse(body);
           if(option=="create")
           {
            if(post.username!='' || post.password!='')
            {
              console.log(post.username);
              console.log(post.password);
              renderHTML('./createusername.html', response);
              con.connect(function(err) 
              {
               if (err) throw err;
                console.log("Connected!");
                var sql = "CREATE TABLE IF NOT EXISTS user (username VARCHAR(255), password VARCHAR(255))";
                con.query(sql, function (err, result) 
                {
                  if (err) throw err;
                  console.log("Table created");
                });
              });
            }
            else{
              console.log("fields left blank");
              response.write("cannot create a user");
              response.end();
            }
          }
        });
}
module.exports = {
  handleRequest: function(request, response) {
      response.writeHead(200, {'Content-Type': 'text/html'});

      var path = url.parse(request.url).pathname;
      switch (path) {
          case '/createusername':
              extract(request, response , "create");
              break;
          case '/deleteusername':
              renderHTML('./deleteusername.html', response);

              break;
          default:
              response.writeHead(404);
              response.write('Route not defined');
              response.end();
      }

  }
};