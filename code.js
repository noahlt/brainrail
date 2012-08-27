Backbone.sync = function() {}; // turn off syncing to server.

Math.signPrefix = function(x) {
  if (x < 0) {
    return '-';
  } else {
    return '';
  }
}

renderTime = function(t) {
  var absTime = Math.abs(t),
      signPrefix = Math.signPrefix(t),
      minutes = Math.floor(absTime / 60).toString(),
      seconds = (absTime % 60).toString();
  if (seconds.length < 2) {
    seconds = '0' + seconds;
  }
  return signPrefix + minutes + ':' + seconds;
}

seconds = function(x) { return x * 1000; }

$(function() {

  var Task = Backbone.Model.extend({
    defaults: {
      'text': 'new task',
      'startTime': NaN,
      'completeTime': NaN,
      'targetCompleteTime': NaN,
    },

    timeRemaining: function() {
      return Math.floor((this.get('targetCompleteTime') - Date.now()) / 1000);
    },

    isComplete: function() {
      return !isNaN(this.get('completeTime'));
    },
  });



  var TaskList = Backbone.Collection.extend({
    model: Task,
  });

  var Tasks = new TaskList;




  var TaskView = Backbone.View.extend({
    tagName: 'tr',

    events: {
      'click button.complete-task': 'complete'
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
    },

    render: function() {
      var completeButton = !this.model.get('completed') ?
        completeButton = '<button class="complete-task">Complete</button>' :
        '';
      this.$el.html('<td>' + this.model.get('text') + '</td>' +
                    '<td>' + renderTime(this.model.timeRemaining()) + '</td>' +
                    '<td>' + completeButton + '</td>');
      if (!this.model.get('completed')) {
        // save the timeout so we can stop the timer from updating after the task
        // is completed.
        this.nextTimeout = setTimeout(this.render.bind(this), 1000);
      }
      return this;
    },

    complete: function() {
      this.$el.addClass('completed');
      this.model.set('completed', true);
      clearTimeout(this.nextTimeout);
    }
  });
  
  

  
  var AppView = Backbone.View.extend({
    el: $("body"),

    events: {
      'click button.add-task': 'addOne'
    },

    addOne: function(e) {
      var now = Date.now(),
          task = Tasks.create({
            text: this.$('input').val(),
            startTime: now,
            targetCompleteTime: now + seconds(parseInt(e.target.dataset['time'])),
            completeTime: NaN
          });
      var view = new TaskView({ model: task });
      this.$('#tasks').append(view.render().el);
    }
  });

  var App = new AppView;
});
