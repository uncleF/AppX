
/* jshint browser:true, jquery:true */
/* global $:false */
/* global Backbone:false */
/* global ScreenView */

'use strict';

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
