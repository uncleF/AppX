/* jshint browser:true, jquery:true */
/* exported router */
/* global Backbone */
/* global app */

'use strict';

var Router = Backbone.Router.extend({
  routes: {
    '': 'start'
  },
  start: function() {
    app.set('state', 'start');
  }
});

var router = new Router();

Backbone.history.start();
