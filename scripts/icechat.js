var myDataRef = new Firebase('https://icechat.firebaseio.com/');
var converter = new Showdown.converter();
var myBotRef = new Firebase('https://icechat-bot.firebaseio.com/');

var botName = 'guyatbooth';
var splittext = ''
botSayHello();

$('#messageInput').keypress(function (e) {
	if (e.keyCode == 13) {
		var name = $('#nameInput').val();
		var text = $('#messageInput').val();
		if (validateForm()){
			if (text.charAt(0) === '!') {
				splittext = text.split(' ');
				if (splittext[0] === '!set') {
					execSet();
				} else if (splittext[0] === '!get') {
					execGet();
				}
				displayChatMessage(name, text);
			} else {
				myDataRef.push({name: name, text: text});
			}
			$('#messageInput').val('');
		}
	}
});

function validateForm() {
	var name = $('#nameInput').val();
	var text = $('#messageInput').val();
	// validate names and messages
	if (name === '' ){
		$('#nameInput').tooltip();
		return false;
	} else if (text === ''){
		$('#messageInput').tooltip();
		return false;
	}
	return true;
}

myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
  isImg = false;
  //TODO: fix this, creating variable every time
  var testImgRegex = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|bmp)$/i;
  if (testImgRegex.test(text)) {
    imgtag = '<img id="image" src=\"' + text + '\">';
    $('<div/>').html(imgtag).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    isImg = true;
  }
  if (isImg === false) {
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

function botSayHello (){
  displayChatMessage(botName, 'Hello my name is ' + botName);
}

function execSet() {
  myBotRef.child(splittext[1]).set(splittext.slice(2).join(' '));
}

function execGet() {
  myBotRef.child(splittext[1]).on('value', function(snapshot) {
    displayChatMessage(botName, snapshot.val());
  });
}
