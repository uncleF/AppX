/* jshint browser:true */

'use strict';

(function() {

  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  var App = Backbone.Model.extend({
    defaults: {
      state: 'start'
    }
  });

  var app = new App();

  var TodoRouter = Backbone.Router.extend({
    model: app,
    routes: {
      '': 'start'
    },
    start() {
      this.model.set('state', 'start');
    }
  });

  app.TodoRouter = new TodoRouter();
  Backbone.history.start();

  app.AppView = Backbone.View.extend({
    el: '#app',
    events: {},
    model: app,
    initialize() {
      this.model.on('change:state', this.render);
    },
    render() {
      return this;
    }
  });

  new app.AppView();

})();
