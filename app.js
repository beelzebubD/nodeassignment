var url = require('url');
var fs = require('fs');
var post ;
var mysql = require('mysql');
var qs = require('querystring');
var con = mysql.createConnection({
  host: "tuy8t6uuvh43khkk.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "kdlfflhaz60phgvg",
  password: "irgbstk2n1jq8lpg"
  database: "yvrg68uo4crm06jm"
}); 
con.connect(function(err) 
 {
    if (err) throw err;
    console.log("Connected! app.js");
 });
var sql = "CREATE TABLE IF NOT EXISTS user (username VARCHAR(255), password VARCHAR(255))";
con.query(sql, function (err, result) 
 {
   if (err) throw err;
   console.log("Table created");
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
function extract(request, response, option) 
{
  var body = '';
  request.on('data', function (data) 
  {
    body += data;
  });
  request.on('end', function ()
  {
   var post = qs.parse(body);
   if(option=="create")
    {
      if(post.username!='' || post.password!='')
      {
        console.log(post.username);
        console.log(post.password);
        var sql = "INSERT INTO user (username, password) VALUES ('"+post.username+"','"+post.password+"')";
        con.query(sql, function (err, result) 
        {
          if (err)
          {
            response.write("cannot create a user");
            response.end();
            throw err;
          }
          console.log("1 record inserted");
          renderHTML('./createusername.html', response);
        });
      }
      else
      {
        console.log("fields left blank");
        response.write("cannot create the user");
        response.end();
      }
    }
    else if(option=="delete")
     {
      if(post.username!='' || post.password!='')
      {
       console.log(post.username);
       console.log(post.password);
       var sql = "DELETE FROM user WHERE username = '"+post.username+"' and password='"+post.password+"'";
       con.query(sql, function (err, result) 
       {
         if (err)
         {
           response.write("cannot delete a user: error occured");
           response.end();
           throw err;
         }
         if(result.affectedRows==0)
         {
           response.write("cannot delete user : user not present");
           response.end();
         }else 
         {
           console.log("Number of records deleted : " + result.affectedRows);
           renderHTML('./deleteusername.html', response);
         }
         });
      }
      else
      {
        console.log("fields left blank");
        response.write("cannot delete a user");
        response.end();
      }
    }else if(option=="update")
     {
      if(post.username!='' || post.password!='')
      {
        console.log(post.username);
        console.log(post.password);
        var sql = "UPDATE user SET password = '"+post.password+"' WHERE username ='"+post.username+"'";
        con.query(sql, function (err, result) 
        {
         if (err)
         {
            response.write("cannot update a user");
            response.end();
            throw err;
         }
         if(result.affectedRows!=0)
          {
            renderHTML('./updateuser.html', response);
            console.log(result.affectedRows + " record(s) updated");
          }else
          {
            response.write("cannot update a user : user not present");
            response.end();
          }
        });                  
      }
        else
        {
         console.log("fields left blank");
          response.write("cannot update a user");
          response.end();
        }
     }else if(option=="getuser")
       {
         if(post.username!='')
          {
           console.log(post.username);
           con.query("SELECT * FROM user WHERE username='"+post.username+"'", function (err, result, fields)
            {
             if (err) throw err;
             var j=0;
             response.write("<h4>username password</h4><br>");
             for(i in result)
             {
              response.write(result[j].username+"  "+result[j].password+'<br>');
              j++;
             }
             response.end();
            });             
         }
         else
          {
            console.log("fields left blank");
            response.write("cannot update a user");
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
          case '/':
              renderHTML('./database.html', response);
              break;
          case '/createusername':
              extract(request, response , "create");
              break;
          case '/deleteusername':
              extract(request, response , "delete");
              break;
          case '/updateuser':
              extract(request, response , "update");
              break;
          case '/getuser':
              extract(request, response , "getuser");
              break;
          default:
              response.writeHead(404);
              response.write('Route not defined');
              response.end();
      }
  }
};