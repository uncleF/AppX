!function(){for(var n=0,i=["ms","moz","webkit","o"],e=0;e<i.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[i[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[e]+"CancelAnimationFrame"]||window[i[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(i){var e=(new Date).getTime(),a=Math.max(0,16-(e-n)),o=window.setTimeout(function(){i(e+a)},a);return n=e+a,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(n){clearTimeout(n)})}();


/* global $:false */
/* global Backbone:false */
/* global ScreenView */

var App = Backbone.Model.extend({
  defaults: {
    state: 'start'
  }
});

var app = new App();

var AppView = Backbone.View.extend({
  model: app,
  id: 'app',
  screens: [],
  initialize: function () {
    this.render();
    this.model.on('change:state', this.changeScreens, this);
    this.createScreen();
  },
  render: function() {
    $('body').prepend(this.$el);
  },
  events: {
    'transitionend .screen-oldScreen, oTransitionEnd .screen-oldScreen, webkitTransitionEnd .screen-oldScreen': function() {
      this.screens[0].unbind();
      this.screens[0].remove();
      this.screens.shift();
      var afterScreenTransitionCall = this.afterScreenTransitionCalls[this.model.get('state') + 'AfterCall'];
      if (typeof afterScreenTransitionCall === 'function') {
        afterScreenTransitionCall();
      }
      $('.screen-newScreen').removeClass('screen-newScreen');
      $('body').removeClass('is-screenTransition is-screenReverseTransition');
    },
    'click .back': function(event) {
      event.preventDefault();
      $('body').addClass('is-screenReverseTransition');
      history.back();
    }
  },
  createScreen: function() {
    var newScreen = new ScreenView();
    if (this.screens.length > 0) {
      newScreen.$el.addClass('screen-newScreen');
    }
    this.screens.push(newScreen);
    this.$el.append(newScreen.$el);
  },
  changeScreens: function() {
    this.createScreen();
    var beforeScreenTransitionCall = this.beforeScreenTransitionCalls[this.model.get('state') + 'BeforeCall'];
    if (typeof beforeScreenTransitionCall === 'function') {
      beforeScreenTransitionCall();
    }
    this.screens[0].$el.addClass('screen-oldScreen');
    setTimeout(function() {
      $('body').addClass('is-screenTransition');
    }, 10);
  },
  beforeScreenTransitionCalls: {

  },
  afterScreenTransitionCalls: {

  }
});

var appView;

$(document).ready(function() {

  appView = new AppView();

});


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


/* global Backbone:false */
/* global app:false */

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
