// YOUR CODE HERE:
var app = {};

app.rooms = new Set();

app.init = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received', data);
      app.displayTweets(data);
      app.setRoomSelector(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
};

app.displayTweets = function(data) {
  var index = 0;
  data.results.forEach(function(tweet) {
    if (!tweet.username || !tweet.text) {
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
  });
};

app.setRoomSelector = function(data) {
  data.results.forEach(function(tweet) {
    if (tweet.roomname) {
      if (!tweet.roomname.includes('<')) {
        app.rooms.add(tweet.roomname);
      } 
    }
  });

  $('#roomSelector').empty();
  this.rooms.forEach(function(room) {
    $('#roomSelector').append("<option value='" + room + "'>" + room + "</option>");
  });
  $('#roomSelector').append("<option value='newRoom'>New room...</option>");
  $('.roomInput').hide();
};

app.makeRoom = function(room) {
  if (room === 'newRoom') {
    $('.roomInput').show();
  } else {
    $('.roomInput').hide();
  }

};

app.newPost = function () {
  var form = document.getElementById('form');
  var message = {};
  message.username = window.location.search.match(/\?username([^\?])*/)[0].split('=')[1];
  message.text = form.message.value;
  if (form.roomSelector.value === 'newRoom') {
    message.roomname = form.roomInput.value;
  } else {
    message.roomname = form.roomSelector.value;  
  }
  this.postMessage(message);
  console.log(message);
};

app.postMessage = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.init();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.init();
