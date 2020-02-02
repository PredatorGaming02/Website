const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    const parsed = url.parse(req.url);
    const fileName = (parsed.pathname != '/' ? "./sites" +  parsed.pathname : "./sites/welcome.html");
    console.log(fileName); 

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    insertConnection(req);

    fs.readFile(fileName, (err, data) => {

        if(err) {

            res.statusCode = 404;
            res.end("404 Not Found.");
            return;

        }

        res.write(data);
        res.end();

    });

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

insertConnection = (req) => {

    const id = randomID(16);
    const date = new Date().toLocaleString();
    const connectionKey = req.socket.server._connectionKey;

    const json = JSON.parse(`{ "${id}": { "time": "${date}", "key": "${connectionKey}" } }\n`);
    fs.appendFileSync("./connections.json", JSON.stringify(json));

}

randomID = (length) => {

    var result = [];
    var set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-?=§$%&'

    for(var i = 0; i < length; i++) {
        result[i] = set[Math.floor(Math.random() * set.length)];
    }

    return result.join('');

}