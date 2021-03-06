#!/usr/bin/env node
/**
* Extremely simple static website serving script
* This is provided in case you need to deploy a quick demo
*
* Install + run:
*
* 		# from parent directory
*
*		cd demo
*		npm install
*		node server
*
*/


var root = __dirname + '/..';
var express = require('express');
var app = express();
app.use('/node_modules', express.static(root + '/node_modules'));
app.use('/views', express.static(root + '/demo/views'));

app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname}));
app.get('/app.css', (req, res) => res.sendFile('app.css', {root: root + '/demo'}));
app.get('/app.js', (req, res) => res.sendFile('app.js', {root: root + '/demo'}));
app.get('/dist/angular-bs-tooltip.js', (req, res) => res.sendFile('angular-bs-tooltip.js', {root: root + '/src'}));

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!').end();
});

var port = process.env.PORT || process.env.VMC_APP_PORT || 8080;
var server = app.listen(port, function() {
	console.log('Web interface listening on port', port);
});
