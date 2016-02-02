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

  var TodoRouter = Backbone.Router.extend({
    routes: {
      '': 'start'
    },
    start() {
      app.set('state', 'start');
    }
  });

  var app = new App();

  app.TodoRouter = new TodoRouter();
  Backbone.history.start();

  app.AppView = Backbone.View.extend({
    el: '#app',
    events: {},
    initialize() {
      app.on('change:state', this.changeScreens, this);
    },
    createScreen() {}
  });

  new app.AppView();

})();
