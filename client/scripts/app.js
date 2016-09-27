// YOUR CODE HERE:
$(document).ready(function() {
  for (var i = 0; i < 10; i++) {
    $('#chats').append("<div class='tweet' id='tweet" + i + "'>" + 
      "<div class='author'></div><div class='tweetText'></div>" + "</div>");
  }
});

var rooms = new Set();

var getAllMessages = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received', data);
      var index = 0;
      data.results.forEach(function(tweet) {
        if (tweet.username === undefined || tweet.text === undefined || tweet.username === '' || tweet.text === '') {
          return;
        } else {
          if (index < 10) {
            tweet.text = tweet.text.replace(/[\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            tweet.username = tweet.username.replace(/[\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            $('#tweet' + index + ' .author').text(tweet.username);
            $('#tweet' + index + ' .tweetText').text(tweet.text);

            index++;
          }
        }
        //if roomname not good ignore
        rooms.add(tweet.roomname);

      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
};

var newPost = function () {
  var form = document.getElementById('form');
  var message = {};
  message.username = window.location.search.match(/\?username([^\?])*/)[0].split('=')[1];
  message.text = form.message.value;
  message.roomname = form.roomSelector.value;
  postMessage(message);
  console.log(message);
};

var postMessage = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      getAllMessages();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

getAllMessages();
