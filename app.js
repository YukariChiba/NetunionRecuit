var express = require('express')
var server = express()

var hbs = require('hbs')

var device = require('express-device');

var index_route = require('./routes/index');
var register_route = require('./routes/register');
var query_route = require('./routes/query')

server.set('view engine', 'hbs')
server.engine('html', hbs.__express);
hbs.registerPartials(__dirname + '/views/steps');
server.use(express.static('public'));

server.use(device.capture());

server.use('/', index_route)
server.use('/', register_route)
server.use('/', query_route)

server.listen(process.env.PORT || 8080)
console.log('Server started.')
