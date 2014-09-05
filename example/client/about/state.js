angular.module('app').config(function ($stateProvider) {
	var state = {
		name: 'about',
		url: '/about',
		templateUrl: '/client/about/tpl.html'
	};

	$stateProvider.state(state);
});