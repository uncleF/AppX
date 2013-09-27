function whichDevice() {
	var USER_AGENT_STRING = navigator.userAgent.toLowerCase();
	var MOBILE_LIST = new Array("iphone os 5", "ipad; cpu os 5", "iphone", "ipad", "android 2", "android", "blackberry", "palmos");
	for (var DEVICE in MOBILE_LIST) {
		if (USER_AGENT_STRING.indexOf(MOBILE_LIST[DEVICE])>=0) {
			return MOBILE_LIST[DEVICE];
		}
	}
}

function whichTransitionEndEvent() {
	var TRANSITION;
	var ELEMENT = document.createElement('fakeelement');
	var TRANSITIONS = {
		"transition": "transitionend",
		"OTransition": "oTransitionEnd",
		"MozTransition": "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	};
	for(TRANSITION in TRANSITIONS){
		if(ELEMENT.style[TRANSITION] !== undefined) {
			return TRANSITIONS[TRANSITION];
		}
	}
}

var transitionEndEvent = whichTransitionEndEvent();var ScreenView = Backbone.View.extend({
	tagName: "section",
	className: "screen",
	templates: {
		"start": _.template($("#start").html()),
	},
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.templates[app.get("state")]);
	}
});var Router = Backbone.Router.extend({
	routes: {
		"": "start"
	},
	start: function() {
		app.set("state", "start");
	}
});

var router = new Router();

Backbone.history.start();var App = Backbone.Model.extend({
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
		"transitionend .oldScreen, oTransitionEnd .oldScreen, webkitTransitionEnd .oldScreen": function() {
			this.screens[0].unbind();
			this.screens[0].remove();
			this.screens.shift();
			var afterScreenTransitionCall = this.afterScreenTransitionCalls[this.model.get("state") + "AfterCall"];
			if (typeof afterScreenTransitionCall == "function") {
				afterScreenTransitionCall();
			}
			$(".newScreen").removeClass("newScreen");
			$("body").removeClass("screenTransition reverseTransition");
		},
		"click .back": function(event) {
			event.preventDefault();
			$("body").addClass("reverseTransition");
			history.back();
		}
	},
	createScreen: function() {
		var newScreen = new ScreenView();
		if (this.screens.length > 0) {
			newScreen.$el.addClass("newScreen");
		}
		this.screens.push(newScreen);
		this.$el.append(newScreen.$el);
	},
	changeScreens: function() {
		this.createScreen();
		var beforeScreenTransitionCall = this.beforeScreenTransitionCalls[this.model.get("state") + "BeforeCall"];
		if (typeof beforeScreenTransitionCall == "function") {
			beforeScreenTransitionCall();
		}
		this.screens[0].$el.addClass("oldScreen");
		setTimeout(function() {
			$("body").addClass("screenTransition");
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