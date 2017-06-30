var socket = io();
socket.on('connect',function(){
    console.log("Connected to server")
});

socket.on('disconnect',function(){
    console.log('Disconnected from server')
});

socket.on('newMessage',function (message){
    var formattedTime = moment(message.createdAt).format('h:mm a')
    if(message.status == ''){
        var li = jQuery('<li></li>');
    }else if(message.status == 'welcome'){
        var li = jQuery('<li style="color:#2DF622;" ></li>');
    }else if(message.status == 'left'){
        var li = jQuery('<li style="color:#FB0A0A;" ></li>');
    }
    li.text(`${message.from} | ${formattedTime} : ${message.text}`)
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    var formattedTime = moment().format('h:mm a')

    var messageTextbox =  jQuery('[name=message]')

    var li = jQuery('<li></li>');
    li.text(`Me ${formattedTime}: ${messageTextbox.val()}`)
    jQuery('#messages').append(li);
    socket.emit('createMessage',{
        from:'User',
        text:messageTextbox.val()
    },function(message){
        messageTextbox.val('')
    })
})

socket.on('newLocationMessage',function (message){
    var li = jQuery('<li></li>')
    var a = jQuery('<a target="_blank" >My current location</a>');
    var formattedTime = moment(message.createdAt).format('h:mm a')

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a)
    jQuery('#messages').append(li);
})

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled','disabled').text('Sending location ...')

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    },function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location')
    })
})