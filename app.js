var express = require('express')
var app = express()

var gpio = require("pi-gpio");
var pin = 11;

// require('coffee-script/register');
var Slack = require('slack-client');

var token = 'xoxb-3786970827-DHG6vn48pPyOZMYhko1PqOPB', // Add a bot at https://my.slack.com/services/new/bot and copy the token here.
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

app.get('/open', function (req, res) {
  openDoor();
    res.send('done!');

});
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

  if (type === 'message' && user.name === 'sakir') {
    if (text === 'open'){
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
function openDoor(){
  console.log('open called');
  gpio.write(pin, 0, function() {});

    setTimeout(function() {
        gpio.write(pin, 1, function(){});
      console.log('closed!')
    }, 1000);
}