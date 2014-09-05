angular.module('app').config(function ($stateProvider) {
	var state = {
		name: 'home',
		url: '/',
		templateUrl: '/client/home/tpl.html',
		controller: 'ExCtrl'
	};

	$stateProvider.state(state);
});