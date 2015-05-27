/* global $:false */
/* global _:false */
/* global Backbone:false */
/* global app:false */

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
