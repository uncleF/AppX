/* jshint browser:true, jquery:true */
/* exported router */
/* global Backbone:false */
/* global app:false */

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
