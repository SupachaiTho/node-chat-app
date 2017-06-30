const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,"../public")

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected')

    socket.emit('newMessage',{
            from:"Admin",
            text:"Welcome to Chat App",
            createAt:new Date().getTime()
        })

    socket.broadcast.emit('newMessage',{
            from:"Admin",
            text:"New user Joined",
            createAt:new Date().getTime()
        })

    socket.on('createMessage',(message)=>{
        console.log('createMessage',message)
        // io.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createAt:new Date().getTime()
        // })

        socket.broadcast.emit('newMessage',{
            from:message.from,
            text:message.text,
            createAt:new Date().getTime()
        })
    })

    socket.on('disconnect',()=>{
    console.log('Disconnected')
    })
})


server.listen(port,()=>{
    console.log(`Server up on port ${port}`)
})
