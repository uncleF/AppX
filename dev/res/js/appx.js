// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* global $:false */
/* global Backbone:false */
/* global ScreenView */

var App = Backbone.Model.extend({
	defaults: {
		state: "start"
	}
});

var app = new App();

var AppView = Backbone.View.extend({
	model: app,
	id: "app",
	screens: [],
	initialize: function () {
		this.render();
		this.model.on("change:state", this.changeScreens, this);
		this.createScreen();
	},
	render: function() {
		$("body").prepend(this.$el);
	},
	events: {
		"transitionend .screen-oldScreen, oTransitionEnd .screen-oldScreen, webkitTransitionEnd .screen-oldScreen": function() {
			this.screens[0].unbind();
			this.screens[0].remove();
			this.screens.shift();
			var afterScreenTransitionCall = this.afterScreenTransitionCalls[this.model.get("state") + "AfterCall"];
			if (typeof afterScreenTransitionCall === "function") {
				afterScreenTransitionCall();
			}
			$(".screen-newScreen").removeClass("screen-newScreen");
			$("body").removeClass("is-screenTransition is-reverseTransition");
		},
		"click .back": function(event) {
			event.preventDefault();
			$("body").addClass("is-reverseTransition");
			history.back();
		}
	},
	createScreen: function() {
		var newScreen = new ScreenView();
		if (this.screens.length > 0) {
			newScreen.$el.addClass("screen-newScreen");
		}
		this.screens.push(newScreen);
		this.$el.append(newScreen.$el);
	},
	changeScreens: function() {
		this.createScreen();
		var beforeScreenTransitionCall = this.beforeScreenTransitionCalls[this.model.get("state") + "BeforeCall"];
		if (typeof beforeScreenTransitionCall === "function") {
			beforeScreenTransitionCall();
		}
		this.screens[0].$el.addClass("screen-oldScreen");
		setTimeout(function() {
			$("body").addClass("is-screenTransition");
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
	tagName: "section",
	className: "screen",
	templates: {
		"start": _.template($("#start").html())
	},
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.templates[app.get("state")]);
	}
});


/* global Backbone:false */

var Router = Backbone.Router.extend({
	routes: {
		"": "start"
	},
	start: function() {
		app.set("state", "start");
	}
});

var router = new Router();

Backbone.history.start();
