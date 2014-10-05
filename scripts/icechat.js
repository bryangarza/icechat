var myDataRef = new Firebase('https://icechat.firebaseio.com/');
var converter = new Showdown.converter();
var myBotRef = new Firebase('https://icechat-bot.firebaseio.com/');

var testImgRegex = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|bmp)$/i;
var botName = 'guyatbooth';
var splittext = ''

$('#messageInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var text = $('#messageInput').val();
    delegateAll(name, text, 'messageInput');
    $('#messageInput').val('');
  }
});

function delegateAll(name, text, from) {
  if (text.charAt(0) === '!')
    delegateCommand(name, text, from);
  else
    delegatePlaintext(name, text, from);
}

function delegateCommand(name, text, from) {
  splittext = text.split(' ');
  if (splittext[0] === '!set') {
    displayChatMessage(name, text);
    execSet();
  } else if (splittext[0] === '!get') {
      if (from === 'messageInput')
        myDataRef.push({name: name, text: text});
      else {
        displayChatMessage(name, text);
        execGet();
      }
  } else if (splittext[0] === '!list')
    execList();
}

function delegatePlaintext(name, text, from) {
  console.log("About to display from delegatePlaintext()");
  console.log("Values: "+ name + ' ' + text);
  if (from === 'messageInput')
    myDataRef.push({name: name, text: text});
  else
    displayChatMessage(name, text);
}

myDataRef.on('child_added', function(snapshot) {
  var message = snapshot.val();
  delegateAll(message.name, message.text, 'child_added');
});

function displayChatMessage(name, text) {
  if (testImgRegex.test(text)) {
    imgtag = '<img id="image" src=\"' + text + '\">';
    $('<div/>').html(imgtag).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
  } else {
    html = converter.makeHtml(text);
    console.log(html);
    $('<div/>').html(html).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
  }
};

function isValidImageUrlCallback(url, answer) {
  alert(url + ': ' + answer);
}

function isValidImageUrl(url, callback) {
  var img = new Image();
  img.onerror = function() { callback(url, false); }
  img.onload =  function() { callback(url, true); }
  img.src = url
}

function execSet() {
  myBotRef.child(splittext[1]).set(splittext.slice(2).join(' '));
}

function execGet() {
  myBotRef.child(splittext[1]).on('value', function(snapshot) {
    displayChatMessage(botName, snapshot.val());
  });
}

function execList() {
  myBotRef.on('child_added', function (snapshot) {
    var alias = snapshot.name();
    var command = snapshot.val();
    displayChatMessage(botName, alias + ': ' + command);
  });
}
