var socket = io();

function scrollToBottom () {

    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect',function(){
    var param = jQuery.deparam(window.location.search);

    socket.emit('join',param,function (err){
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No error')
        }
    })
});

socket.on('disconnect',function(){
    console.log('Disconnected from server')
});

socket.on('updateUserList',function(users){
    var ol = jQuery('<ol></ol>');

    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user))
    })

    jQuery('#users').html(ol)
})

socket.on('newMessage',function (message){

    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    // var formattedTime = moment(message.createdAt).format('h:mm a')
    // if(message.status == ''){
    //     var li = jQuery('<li></li>');
    // }else if(message.status == 'welcome'){
    //     var li = jQuery('<li style="color:#2DF622;" ></li>');
    // }else if(message.status == 'left'){
    //     var li = jQuery('<li style="color:#FB0A0A;" ></li>');
    // }
    // li.text(`${message.from} | ${formattedTime} : ${message.text}`)
    // jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    var messageTextbox =  jQuery('[name=message]')

    socket.emit('createMessage',{
        from:'User',
        text:messageTextbox.val()
    },function(message){
        messageTextbox.val('')
    })
})

socket.on('newLocationMessage',function (message){

    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    // var li = jQuery('<li></li>')
    // var a = jQuery('<a target="_blank" >My current location</a>');
    // var formattedTime = moment(message.createdAt).format('h:mm a')

    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a)
    // jQuery('#messages').append(li);
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