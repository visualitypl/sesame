var express = require('express')
var app = express()

var gpio = require("pi-gpio");
var pin = 11;

/* gpio */
gpio.close(pin);                     // Close pin 16

gpio.open(pin, "output", function(err) {     // Open pin 16 for output
    gpio.write(pin, 1, function() {});
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/open', function (req, res) {
  console.log('open called');
  gpio.write(pin, 0, function() {});

    setTimeout(function() {
        gpio.write(pin, 1, function(){});
      console.log('closed!')
    }, 1000);
    res.send('done!');

});
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
