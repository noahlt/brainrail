Backbone.sync = function() {}; // turn off syncing to server.

$(function() {

  var Task = Backbone.Model.extend({
    defaults: {
      'text': 'new task',
      'time': 10
    }
  });



  var TaskList = Backbone.Collection.extend({
    model: Task,
  });

  var Tasks = new TaskList;




  var TaskView = Backbone.View.extend({
    tagName: 'li',

    render: function() {
      this.$el.html(this.model.get('text'));
      return this;
    }
  });
  
  

  
  var AppView = Backbone.View.extend({
    el: $("body"),

    events: {
      'click button': 'addOne'
    },

    addOne: function() {
      console.log('hi');
      var task = Tasks.create({ text: this.$('input').val() });
      var view = new TaskView({ model: task });
      this.$('#tasks').append(view.render().el);
    }
  });

  var App = new AppView;
});