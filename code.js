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

    initialize: function() {
      if (!this.get('completeTime')) {
        this.set({'completeTime': this.defaults.completeTime});
      }
    },

    timeRemaining: function() {
      var x = Math.floor((this.get('targetCompleteTime') -
                           (this.get('completeTime') || Date.now())) / 1000);
      return x;
    },

    isComplete: function() {
      return !isNaN(this.get('completeTime'));
    },

    isOvertime: function() {
      return !this.isComplete() && this.timeRemaining() < 0;
    }
  });



  var TaskList = Backbone.Collection.extend({
    model: Task,

    localStorage: new Store('mindrail-backbone'),
  });

  var Tasks = new TaskList;




  var TaskView = Backbone.View.extend({
    tagName: 'tr',

    events: {
      'click button.complete-task': 'complete',
      'click button.destroy-task': 'destroy'
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
    },

    render: function() {
      var action = !this.model.isComplete() ?
                   '<button class="complete-task">Complete</button>' :
                   '<button class="destroy-task">x</button>';
      this.$el.html('<td class="text">' + this.model.get('text') + '</td>' +
                    '<td class="timer">' + renderTime(this.model.timeRemaining()) + '</td>' +
                    '<td class="action">' + action + '</td>');
      if (this.model.isOvertime()) {
        this.$el.find('.text, .timer').addClass('overtime');
      }
      if (!this.model.isComplete()) {
        // save the timeout so we can stop the timer from updating after the task
        // is completed.
        this.nextTimeout = setTimeout(this.render.bind(this), 1000);
      } else {
        this.$el.addClass('completed');
      }
      return this;
    },

    complete: function() {
      this.$el.addClass('completed');
      this.model.set('completeTime', Date.now());
      this.model.save();
      clearTimeout(this.nextTimeout);
      $('input').focus(); // refocus on text input for easy entry
    },

    destroy: function() {
      this.model.destroy();
      this.$el.detach();
      $('input').focus(); // refocus on text input for easy entry
    }
  });
  
  

  
  var AppView = Backbone.View.extend({
    el: $("body"),

    events: {
      'click button.add-task': 'newTask'
    },

    initialize: function() {
      this.$input = this.$('input').focus();
      Tasks.bind('reset', this.reloadTasks, this);
      Tasks.fetch();
    },

    addTask: function(task) {
      var view = new TaskView({ model: task });
      this.$('#tasks').append(view.render().el);
    },

    newTask: function(e) {
      var now = Date.now(),
          task = Tasks.create({
            text: this.$input.val(),
            startTime: now,
            targetCompleteTime: now + seconds(parseInt(e.target.dataset['time'])),
            completeTime: NaN
          });
      this.addTask(task);
      this.$input.val('').focus();
    },

    reloadTasks: function() {
      Tasks.each(this.addTask);
    }
  });

  var App = new AppView;
});
