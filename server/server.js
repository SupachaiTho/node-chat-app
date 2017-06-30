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

    socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'))

    socket.broadcast.emit('newMessage',generateMessage('Admin','New user jointed'))

    socket.on('createMessage',(message, callback)=>{
        console.log('createMessage',message)
        socket.broadcast.emit('newMessage',generateMessage(message.from,message.text))
        callback('This from server');
    })

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude))
    })

    socket.on('disconnect',()=>{
    console.log('Disconnected')
    })
})


server.listen(port,()=>{
    console.log(`Server up on port ${port}`)
})
