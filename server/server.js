const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message')

const publicPath = path.join(__dirname,"../public")

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected')

    var socketId = socket.id;
    var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

    socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'))

    socket.broadcast.emit('newMessage',generateMessage('Admin',`${clientIpAddress} joited`))

    socket.on('createMessage',(message, callback)=>{
        socket.broadcast.emit('newMessage',generateMessage(clientIpAddress,message.text))
        callback();
    })

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage(clientIpAddress,coords.latitude,coords.longitude))
    })

    socket.on('disconnect',()=>{
    socket.on('createMessage',(message, callback)=>{
        socket.broadcast.emit('newMessage',generateMessage('Admin',`${clientIpAddress} was left`))
        callback();
    })
    })
})


server.listen(port,()=>{
    console.log(`Server up on port ${port}`)
})
