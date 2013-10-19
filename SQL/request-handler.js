var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "");
var path = require("path");
var url = require("url");
var fs = require('fs');
// we rolled our own basic query parser for this but in the future could just use queryString module

var handleRequest = function(request, response) {
  var statusCode = 404;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var responseBody = "Not Found";
  var reply = function() {
    response.writeHead(statusCode, headers);
    response.end(responseBody);
  };
  var setResponse = function(string) {
    responseBody = string;
    reply();
  };

  var parseQueryString = function(url){
    var options = {};
    var queryString = url.slice(url.indexOf('?')+1);
    if (queryString === url) { return options; }
    var pairs = queryString.split('&');
    for (var i=0; i<pairs.length; i++) {
      var pair = pairs[i].split('=');
      options[pair[0]] = pair[1];
    }
    return options;
  };

  var serveFile = function(){
    statusCode = 200;
    if (pathname === '/') {
      headers['Content-Type'] = "text/html";
      setResponse(fs.readFileSync(path.join(__dirname,'/client/index.html')));
    } else {
      headers['Content-Type'] = (pathname === '/styles/styles.css') ? "text/css" : "text/javascript";
      setResponse(fs.readFileSync(path.join(__dirname,'/client' + pathname)));
    }
  };

  var storageAccess = function(){
    if (request.method === 'POST') {
      var data = '';
      statusCode = 201;
      request.on('data', function(chunk) {
        data += chunk;
      });
      request.on('end', function() {
        console.log("POST REQUEST",JSON.parse(data)); // TODO: refactor to use Sequalize
        console.log(data.username);
        Message.create({
          UserId: data.username,
          message: data.text,
          RoomId: data.room
        }).success(function(){
          setResponse("Message received.");
        });
        // username, text, room
      });
    } else if (request.method === 'GET') {
      headers['Content-Type'] = "application/json";
      statusCode = 200;
      var options = parseQueryString(request.url);
      console.log(options); // options = {order: "-createdAt", room: "lobby"}
      Message.findAll({order: options.order});
      // var messages = storage.get(options); // TODO: refactor to use Sequalize
      setResponse(JSON.stringify(options));
    }
  };

  var getRooms = function(){
    headers['Content-Type'] = "application/json";
    statusCode = 200;
    rooms = storage.getRooms(); // TODO: refactor to use Sequalize
    responseBody = JSON.stringify(rooms);
  };

  var router = {
    '/classes/chatterbox': storageAccess, // TODO: refactor to use Sequalize
    '/classes/room1': storageAccess,
    '/classes/getrooms': getRooms,
    '/': serveFile,
    '/styles/styles.css': serveFile,
    '/scripts/app.js': serveFile,
    '/scripts/config.js': serveFile,
    '/favicon.ico': serveFile
  };

  var pathname = url.parse(request.url).pathname;
  router[pathname]();
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};

module.exports = handleRequest;




var User = sequelize.define('User', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  user_name: Sequelize.STRING
});

var Room = sequelize.define('Room', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  message: Sequelize.STRING
});

Message.belongsTo(User);
Message.belongsTo(Room);
User.hasMany(User, {as: 'Friends'});
User.hasMany(User, {as: 'Blocked'});

User.sync().success(function() {
  console.log("created User table");
});
Room.sync();
Message.sync();