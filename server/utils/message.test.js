const expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message')

describe('generate message',()=>{
    it('should generate correct message object',()=>{
        var from = "Joe"
        var text = "Hi test"
        var message = generateMessage(from,text,'')

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text})
    })
})

describe('generate location message',()=>{
    it('should generate correct location message object',()=>{
        var from = "Joe"
        var lat = 15
        var long = 19
        var url = 'https://www.google.com/maps?q=15,19'
        var message = generateLocationMessage(from,lat,long)

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,url})
    })
})