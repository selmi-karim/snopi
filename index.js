'use strict';


const express = require('express');
const app = express();
const request = require('request');
require('dotenv').config();

app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;


const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});
var face = io.of('/face').on('connection', function(socket) {});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});


io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      let aiAction = response.result.action;
      if(aiAction=='input.unknown'){
        face.emit('emotionchange',{emotion:'sad'});
      }else{
        face.emit('emotionchange',{emotion:'happy'});
      }
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
      face.emit('message', {message: 'You:'+text+'\nSnopi:'+aiText});
      face.emit('talking', {talking: 'true'});

    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
