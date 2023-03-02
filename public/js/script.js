'use strict';

const socket = io();

var face = io.connect(window.location.href + "face");


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;

recognition.start();


recognition.addEventListener('audioend', () => {
  console.log('Audio capturing ended');
  //recognition.start();
});



recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});


recognition.addEventListener('result', (e) => {

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
  console.log("text: ", text);
  socket.emit('chat message', text);
});


recognition.addEventListener('speechend', () => {
  console.log("speechend ")

});


recognition.addEventListener('nomatch', (e) => {
  console.log("nomatch ", e)

  startMicro();
});

recognition.addEventListener('error', (e) => {
  console.log("ERROR ", e)
  // emotionchange({ emotion: "sad" });

  //face.emit('talking', {talking: 'true'});

});

window.addEventListener("load", () => {
  if ('speechSynthesis' in window) {
    // Speech Synthesis supported 🎉v
  } else {
    // Speech Synthesis Not Supported 😣
    alert("Sorry, your browser doesn't support text to speech!");
  }
});

function synthVoice(text, callback) {
  recognition.stop();
  document.getElementById("faceCanvasButton").click();

  var synth = window.speechSynthesis;
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  synth.speak(msg);
  callback('ok');
  msg.addEventListener('end', (event) => {
    talking({ talking: 'false' });
    emotionchange({ emotion: "default" });
    recognition.start();
  });


};

socket.on('bot reply', function (replyText) {
  console.log("bot reply")
  //synthVoice(replyText, function (data) {
  //  recognition.start();
  //});
  //if (replyText == '') replyText = '(No answer...)';
});

socket.on('message', function (data) {
  console.log(data);
});
face.on('emotionchange', function (data) {
  console.log(data);
  rF.currentEmotion = data.emotion.replace(/(\r\n|\n|\r)/gm, "");
});

face.on('message', function (data) {
  console.log("rec", data);
  synthVoice(data.message, function (data) {
    //alert(data);
    //startMicro();
  });

  // //PaperJS doesn't seem to allow multiline textboxes so pretty terrible hack:
  // var str = data.message.replace(/(\r\n|\n|\r)/gm, "=");
  // console.log("message:", str);
  // if (str == "") {
  //   rF.activeBubble = false;
  //   console.log("bubble off");
  // } else {
  //   rF.activeBubble = true;
  //   console.log("bubble on");
  // }
  // var brk = "=";
  // var width = 16;
  // var cut = false;
  // var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
  // str = str.match(RegExp(regex, 'g')).join(brk);
  // var lines = str.split("=");
  // tData.bubble.talk.content = lines[0] || "";
  // tData.bubble.talk2.content = lines[1] || "";
  // tData.bubble.talk3.content = lines[2] || "";
  // tData.bubble.talk4.content = lines[3] || "";
  // tData.bubble.talk5.content = lines[4] || "";
});

face.on('emotionchange', function (data) {
  console.log(data);
  rF.currentEmotion = data.emotion.replace(/(\r\n|\n|\r)/gm, "");
});

face.on('talking', function (data) {
  console.log(data);
  if (data.talking.replace(/(\r\n|\n|\r)/gm, "") == "true") {
    rF.talkingState = true;
  } else {
    rF.talkingState = false;
  }
});

face.on('eyeUpdate', function (data) {
  console.log(data.eyeData);
  var eyeData = data.eyeData.replace(/(\r\n|\n|\r)/gm, "").split(":");
  rF.status.eyeData.content = "x:" + eyeData[0] + " y:" + eyeData[1] + " z:" + eyeData[2];

  var result = calc.EyeMovement(eyeData[0], eyeData[1], eyeData[2]);
  rF.eyeUpdate(result);
});

face.on('debug', function (data) {
  console.log(data);
  if (data.debug.replace(/(\r\n|\n|\r)/gm, "") == "true") {
    rF.debug(true);
  } else {
    rF.debug(false);
  }
});



const emotionchange = (data) => {
  rF.currentEmotion = data.emotion.replace(/(\r\n|\n|\r)/gm, "");
};

const message = (data) => {
  console.log("bloew ", data.message);
};

const talking = (data) => {
  console.log(data);
  if (data.talking.replace(/(\r\n|\n|\r)/gm, "") == "true") {
    rF.talkingState = true;
  } else {
    rF.talkingState = false;
  }
};
