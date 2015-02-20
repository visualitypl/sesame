var express = require('express')
var app = express()

var gpio = require("pi-gpio");
var pin = 11;


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/open', function (req, res) {
    gpio.open(pin, "output", function(err) {});
    gpio.write(pin, 0, function() {});

    setTimeout(function() {
        gpio.write(pin, 1, function(){});
    }, 1000);
    gpio.close(pin);

    console.log('open called!')
});
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
