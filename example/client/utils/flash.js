angular.module('app').config(function (flashProvider, $logProvider) {
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
});