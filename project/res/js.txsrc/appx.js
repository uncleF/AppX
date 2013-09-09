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