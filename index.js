'use strict';

const express = require('express');
const app = express();
const request = require('request');
require('dotenv').config();

app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
  console.log('a user connected');
});
var face = io.of('/face').on('connection', function (socket) { });

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from GPT3
    OpenaiFetchAPI(text)
  });
});

function OpenaiFetchAPI(text) {
  var url = "https://api.openai.com/v1/completions";
  var bearer = 'Bearer ' + process.env.APIAI_TOKEN
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0
    })
  }).then(response => {

    return response.json()

  }).then(data => {

    face.emit('message', { message: data["choices"][0].text });
    face.emit('talking', { talking: 'true' });

  })
    .catch(error => {
      console.log('Something bad happened ' + error)
    });

}
