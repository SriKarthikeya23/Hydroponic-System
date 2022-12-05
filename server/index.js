// 127.0.0.1:1883
// 35.234.254.79

const express = require('express');
const app = express();
const cors = require('cors');
const mqtt = require('mqtt');

app.use(cors());
app.use(express.json());

// temperature, humidity, moisture, light
var temp = mqtt.connect('mqtt://35.234.254.79:1883');
var humidity = mqtt.connect('mqtt://35.234.254.79:1883');
var moisture = mqtt.connect('mqtt://35.234.254.79:1883');
var light = mqtt.connect('mqtt://35.234.254.79:1883');

var temp_data = 0;
var hum_data = 0;
var moisture_data = 0;
var light_data = 0;

temp.on('connect', function() {
    temp.subscribe("temperature/data");
    console.log("temperature topic has subscribed successfully");
});

temp.on('message', function(topic, message) {
    console.log("Temperature Data : " + message.toString());    
    temp_data = parseInt(message.toString());
});

humidity.on('connect', function() {
    humidity.subscribe("humidity/data");
    console.log("humidity topic has subscribed successfully");
});

humidity.on('message', function(topic, message) {
    console.log("Humidity Data : " + message.toString());    
    hum_data = parseInt(message.toString());
});

moisture.on('connect', function() {
    moisture.subscribe("moisture/data");
    console.log("moisture topic has subscribed successfully");
});

moisture.on('message', function(topic, message) {
    console.log("Moisture Data : "+ message.toString());
    moisture_data = parseInt(message.toString());
});

light.on('connect', function() {
    light.subscribe("light/data");
    console.log("light topic has subscribed successfully");
});

light.on('message', function(topic, message) {
    console.log("Light intensity Data : "+ message.toString());
    light_data = parseInt(message.toString());
})

app.get('/get/hydroponic/data', (req, res) => {
    var data = {
        "temperature" : temp_data,
        "humidity" : hum_data,
        "moisture" : moisture_data,
        "light" : light_data
    }
    res.send(data);
});

var motor_data = 0;
var motor_temp = 0;
var motor = mqtt.connect('mqtt://35.234.254.79:1883');
motor.on("connect", function() {
    setInterval(function() {
        if(motor_data != motor_temp){
            motor.publish('motor/data',motor_data.toString());
            motor_temp = motor_data;
        }
    }),1000;
});

app.post('/post/motor', (req, res) => {
    motor_data = req.body.data;
    console.log(motor_data);
    res.send("data received");
});

app.get('/get/motor', (req, res) => {
    var data = {
        "data" : motor_data
    }
    res.send(data);
})

app.listen(3002, () => {
    console.log("your server is running on 3002");
});
