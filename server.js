var fs = require('fs');

var express = require('express');
var app = express();

app.use(express.static(__dirname));

var https = require('https');
var privateKey  = fs.readFileSync('threedee-key.pem', 'utf8');
var certificate = fs.readFileSync('threedee-cert.pem', 'utf8');

var credentials = {
	key: privateKey, 
	cert: certificate
};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443);