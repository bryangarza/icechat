var myDataRef = new Firebase('https://icechat.firebaseio.com/');

$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var text = $('#messageInput').val();
    myDataRef.push({name: name, text: text});
    $('#messageInput').val('');
    }
});

myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
  var testImgRegex = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|bmp)$/i;
  if (testImgRegex.test(text)) {
    imgtag = '<img id="image" src=\"' + text + '\">';
    $('<div/>').html(imgtag).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
  }
  else {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
  }
  $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
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

var bot = Object.create(Bot);

bot.init('swagbot');
bot.sayHello();
