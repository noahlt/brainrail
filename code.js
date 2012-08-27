Backbone.sync = function() {}; // turn off syncing to server.

Math.signPrefix = function(x) {
  if (x < 0) {
    return '-';
  } else {
    return '';
  }
}

$(function() {

  var Task = Backbone.Model.extend({
    defaults: {
      'text': 'new task',
      'time': 120 // seconds
    },

    tick: function() {
      this.set('time', this.get('time') - 1);
    }
  });



  var TaskList = Backbone.Collection.extend({
    model: Task,
  });

  var Tasks = new TaskList;




  var TaskView = Backbone.View.extend({
    tagName: 'tr',

    initialize: function() {
      this.model.bind('change', this.render, this);
    },

    render: function() {
      var absTime = Math.abs(this.model.get('time')),
          signPrefix = Math.signPrefix(this.model.get('time')),
          minutes = Math.floor(absTime / 60).toString(),
          seconds = (absTime % 60).toString();
      if (seconds.length < 2) {
        seconds = '0' + seconds;
      }
      this.$el.html('<td>' + this.model.get('text') + '</td>' +
                    '<td>' + signPrefix + minutes + ':' + seconds + '</td>');
      return this;
    }
  });
  
  

  
  var AppView = Backbone.View.extend({
    el: $("body"),

    events: {
      'click button': 'addOne'
    },

    addOne: function(e) {
      var task = Tasks.create({
        text: this.$('input').val(),
        time: parseInt(e.target.dataset['time'])
      });
      var view = new TaskView({ model: task });
      this.$('#tasks').append(view.render().el);
    }
  });

  var App = new AppView;


  window.setInterval(function() {
    Tasks.each(function(task) { task.tick(); });
  }, 1000);
});
