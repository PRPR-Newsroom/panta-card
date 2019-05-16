// server.js
// where your node app starts

let compression = require('compression');
let cors = require('cors');
let express = require('express');
let nocache = require('node-nocache');
let http = require('http');
let fs = require('fs');

let  options = {
    // key: fs.readFileSync('key.pem', 'utf8'),
    // cert: fs.readFileSync('cert.pem', 'utf8'),
    // passphrase: process.env.HTTPS_PASSPHRASE || ''
};

let app = express();

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({origin: 'https://trello.com'}));

// https://github.com/mingchen/node-nocache
app.use('/version.jsonp', nocache, function (request, response) {
    response.header('Content-Type', 'application/javascript');
    fs.readFile(__dirname + '/VERSION', 'utf-8', function (err, contents) {
        response.send('var versionInfo={name:"' + contents + '"}');
    });
});

app.use('/auth', nocache, function(request, response) {
    response.header('Content-Type', 'application/json');
    let username = request.query.username;
    let password = request.query.password;
    console.log("Username/Password", username, password);
    if (username === "admin" && password === "KpFbQPt8664sP8Np") {
        response.status(202).send("{ \"result\": \"success\"}");
    } else {
        response.status(401).send("{ \"result\": \"error\"}");
    }
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

let server = http.createServer(options, app);
let port = 8080;

console.log("Server listening on port " + (port));
server.listen(port);
