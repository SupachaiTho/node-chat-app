const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/user');

const publicPath = path.join(__dirname,"../public")

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected')

    var socketId = socket.id;

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required')
        }

        socket.join(params.room)
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room))

        socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'))
        socket.emit('newMessage',generateMessage('Admin','Who are you ?'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} was joited`))
    })

    socket.on('createMessage',(message, callback)=>{
        socket.broadcast.to(users.getUser(socket.id).room).emit('newMessage',generateMessage(users.getUser(socket.id).name,message.text))
        callback();
    })

    socket.on('createLocationMessage',(coords)=>{
        io.to(users.getUser(socket.id).room).emit('newLocationMessage',generateLocationMessage(users.getUser(socket.id).name,coords.latitude,coords.longitude))
    })

    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }
    })
})


server.listen(port,()=>{
    console.log(`Server up on port ${port}`)
})
