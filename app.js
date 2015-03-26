var express = require('express')
var app = express()
var config = require('./config')

var gpio = require("pi-gpio");
var pin = 11;
var relayOpen = false;

// require('coffee-script/register');
var Slack = require('slack-client');

var token = config.SLACK_TOKEN, // Add a bot at https://my.slack.com/services/new/bot and copy the token here.
    autoReconnect = true,
    autoMark = true;
var slack = new Slack(token, autoReconnect, autoMark);
slack.on('open', function() {
  var unreads = slack.getUnreadCount();
  console.log('Welcome to Slack. You are @%s of %s', slack.self.name, slack.team.name);
});


/* gpio */
gpio.close(pin);                     // Close pin 16

gpio.open(pin, "output", function(err) {     // Open pin 16 for output
    gpio.write(pin, 1, function() {});
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

/* Slack */
slack.on('message', function(message) {
  var type = message.type,
      channel = slack.getChannelGroupOrDMByID(message.channel),
      user = slack.getUserByID(message.user),
      time = message.ts,
      text = message.text,
      response = '';

  console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);

  if (type === 'message' && (user.name === 'neko' || user.name === 'sakir')) {
    if (text === 'open' || (text.indexOf('open ') === 0)){
      
      if(text === 'open'){
        doorTimeout = 1;
      }else{
        doorTimeout = parseInt( text.replace("open ", "") );
      }

      if(doorTimeout > 10){
        doorTimeout = 1;
      }

      if (doorTimeout == 0){
        closeRelay();
      }else{
        openDoor(doorTimeout);
      }
      response = 'ok';
      channel.send(response);
      console.log('@%s responded with "%s"', slack.self.name, response);
    }
  }
});

slack.on('error', function(error) {
  console.error('Error: %s', error);
});

slack.login();
/* /slack */
function openDoor(doorTimeout){
  doorTimeout = doorTimeout || 1;
  if(!relayOpen){
    relayOpen = true;
    console.log('open called');
    gpio.write(pin, 0, function() {});

      setTimeout(function() {
          closeRelay();
      }, (doorTimeout * 1000));
  }
}

function closeRelay(){
  gpio.write(pin, 1, function(){});
  console.log('closed!');
  relayOpen = false;
}