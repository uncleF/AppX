/* jshint browser:true, jquery:true */
/* exported ScreenView */
/* global _ */
/* global Backbone */
/* global app */

'use strict';

var ScreenView = Backbone.View.extend({
  tagName: 'section',
  className: 'screen',
  templates: {
    'start': _.template($('#start').html())
  },
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(this.templates[app.get('state')]);
  }
});
