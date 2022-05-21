function start_html_server() {
    const http = require('http');
    const fs = require('fs');
    var path = require('path');

    const hostname = '0.0.0.0';
    const port = 8080;


    const server = http.createServer(function (request, response) {
        var filePath = '.' + request.url;
        if (filePath == './') {
            filePath = './index.html';
        }
        var extname = String(path.extname(filePath)).toLowerCase();
        var mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mp3',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm',
            '.ico': 'image/x-icon'
        };

        var contentType = mimeTypes[extname] || 'application/octet-stream';
        fs.readFile(filePath, function(error, content) {
            if(error) {
                if(error.code === 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(404, {'ContentType': 'text/html'});
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                }
            }
            else {
                response.writeHeader(200, {"Content-Type": contentType});
                response.end(content, 'utf-8');
            }
        });
    }).listen(port, hostname, () => {
        console.log("Server running at http://web-i89da9153-fa4a.docodev2.qwasar.io/");
    });
}

start_html_server();