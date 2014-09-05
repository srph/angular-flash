angular.module('app', ['angular-flash', 'ngAnimate', 'ui.router']);
angular.module('app').config(["flashProvider", "$logProvider", function (flashProvider, $logProvider) {
	$logProvider.debugEnabled(true);

	flashProvider
		.register({ 'type': 'error', 'class': 'alert alert-danger'})
		.register({ 'type': 'success', 'class': 'alert alert-success'})
		.register({ 'type': 'info', 'class': 'alert alert-info'})
		.register({ 'type': 'warning', 'class': 'alert alert-warning'});

	flashProvider.register([
		{ 'type': 'info', 'class': 'alert alert-info'},
		{ 'type': 'warning', 'class': 'alert alert-warning' },
	]);

	// An example of lifetime being configured
	flashProvider.lifetime(5000);
}]);
angular.module('app').config(["$locationProvider", function ($locationProvider) {
	$locationProvider.hashPrefix('!');
}]);
angular.module('app').config(["$urlRouterProvider", function ($urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
}]);
app.controller('ExCtrl', ["$scope", "flash", function ($scope, flash) {
	var random, messages, types;

	/**
	 * Randomize values
	 * 
	 * @return {[void]}
	 */
	function randomizer () {
		random = Math.ceil(Math.random() * (3) + 0);
		messages = [
			'Currently processing your request...',
			'Yes, milord!',
			'Justice is ours.',
			'I came in like a wrecking ball!'];
	}

	/**
	 * Initialize random values
	 */
	(function () {
		randomizer();
		types = ['danger', 'success', 'info', 'warning'];
	})();

	/**
	 * Normally flash a message
	 * 
	 * @return {[void]}
	 */
	$scope.flash = function () {
		// Randomize values
		randomizer();

		// Fire a flash messages
		flash.fire({ 'type': types[random], 'message':  messages[random] });
	};

	/**
	 * Flashes a unique message
	 * 
	 * @return {[void]}
	 */
	$scope.flashUnique = function () {
		// Randomize values
		randomizer();

		var type =  types[random],
			message = 'If there is another message of same type and message, it will not flash until this one expires.';
			// message = messages[random];

		flash.fire({ 'type': type, 'message': message, unique: true });
	};
}]);
angular.module('app').config(["$stateProvider", function ($stateProvider) {
	var state = {
		name: 'home',
		url: '/',
		templateUrl: '/client/home/tpl.html',
		controller: 'ExCtrl'
	};

	$stateProvider.state(state);
}]);
angular.module('app').config(["$stateProvider", function ($stateProvider) {
	var state = {
		name: 'about',
		url: '/about',
		templateUrl: '/client/about/tpl.html'
	};

	$stateProvider.state(state);
}]);
console.log('Application is starting..');

try {
	angular.bootstrap(document, ['app']);
} catch(e) {
	console.error(e.stack || e.message || e);
}