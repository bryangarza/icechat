var Bot = {
  init: function(nameParam) {
    this.name = nameParam;
  },
  sayHello: function() {
    displayChatMessage(this.name, 'Hello my name is ' + this.name);
  }
};
