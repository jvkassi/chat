var http = require('http')

//var fs = require('fs')

var express = require('express');

var app = express();
app.set('port', (process.env.PORT || 5000));

var server =http.createServer(app);

//app.set('port', (process.env.PORT || 7000));

//app.use(express.static(_dirname + '/public'));

//app.set('views', __dirname + '/views');
//app.set('views engine', 'mustache');

app.get('/', function(request, response){
    response.sendFile("index.html", {"root": __dirname});
});

/*app.listen(app.get('port'), function(){
    console.log(app.get('port'));
});*/

//var server =http.createServer((req, res) => {
   // console.log("Tok tok");
//})//

var server = require('http').Server(app);


var io = require('socket.io').listen(server)
//var mustache = require('mustache')

server.listen(process.env.PORT || 5000);


var users =  {};

var messages = [];

var history = 5;


io.sockets.on('connection', function(socket) {
   
    var newUser = false;
    console.log("Nouveau Utilisateur");

    for(var u in users){
        socket.emit('new', users[u])
    
    }

    for(var m in messages){
        socket.emit('newmsg', messages[m])
    
    }


     //Message reçu
    socket.on('newmsg', function(message){
        message.user = newUser;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        messages.push(message);
        if(messages.length > history){
            messages.shift();
        }

        io.sockets.emit('newmsg', message);
    })

    socket.on('login', function(user){
        newUser = user;
        newUser.id = user.mail.replace('@', '-').replace('.', '-');
        newUser.avatar = 'kimt.jpg';
        console.log(newUser);
        users[newUser.id] = newUser;
        socket.emit('logged');
        io.sockets.emit('new', newUser);
        // socket.emit('connecterU', newUser);
    //socket.broadcast.emit('new', newUser);
    })

      
    socket.on('disconnect', function(){
        if(!newUser){
            return false;
        }

        delete users[newUser.id];
        io.sockets.emit('deco', newUser);
    })



  
     
})
