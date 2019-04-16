// server.js
// where your node app starts

let compression = require('compression');
let cors = require('cors');
let express = require('express');
let nocache = require('node-nocache');
let https = require('https');
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

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

let server = https.createServer(options, app);

console.log("Server listening on port " + (process.env.SERVER_PORT || 8443));
server.listen(process.env.SERVER_PORT || 8443);
