var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

  if ( uri === "/getNewItems" ) {
    var _get = url.parse(request.url, true).query;
     // Write headers to the response.
     response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
     });
     // Send data and end response.
     var idsParam = _get['ids'],
       markup = "";
       if (idsParam) {
         var ids = idsParam.split(",");
         for (var i = 0; i < ids.length; i+= 1) {
           var id = ids[i];
           if (id) {
             markup += '<li data-id="' + id + '"><span>:</span> item ' + id + '</li>\n';
           }
         }
       }
     response.end(markup);
    return;
  }

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

  if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
