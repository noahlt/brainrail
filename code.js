Backbone.sync = function() {}; // turn off syncing to server.

$(function() {

  var Task = Backbone.Model.extend({
    defaults: {
      'text': 'new task',
      'time': 60 // seconds
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
      this.$el.html('<td>' + this.model.get('text') + '</td>' +
                    '<td>' + this.model.get('time') + '</td>');
      return this;
    }
  });
  
  

  
  var AppView = Backbone.View.extend({
    el: $("body"),

    events: {
      'click button': 'addOne'
    },

    addOne: function() {
      var task = Tasks.create({ text: this.$('input').val(), time: 60 });
      var view = new TaskView({ model: task });
      this.$('#tasks').append(view.render().el);
    }
  });

  var App = new AppView;


  window.setInterval(function() {
    console.log('---------------------');
    Tasks.each(function(task) {
      task.tick();
      //console.log(task.get('text'), task.get('time'));
    });
  }, 1000);
});