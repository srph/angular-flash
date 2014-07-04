app.directive('flash', [function() {

	var controller = function($scope, $rootScope, $timeout, $flash) {
		// Removes the first one in the list every 5 seconds
		// until none remains
		var shift = function() {
			$timeout(function() {
				$flash._list.shift();
				$scope.list = $flash._list;
				$rootScope.$emit('$flashFiredRemoved');
			}, $flash.lifetime(), true);
		}

		$rootScope.$on('$flashFired', function() {
			console.log('Fired!');
			$scope.list = $flash._list;
			console.log($scope.list.length);
			// Let the removal of every 0-index in the array begin
			shift();
		});
	};

	// Directive template
	var template =
		'<div id="ng-notification-flash-container" style="position: fixed; left: 0; right: 0;">' +
			'<div id="ng-notification-flash-inner" ng-repeat="item in list" class="{{ item.type }}" style="display: block; background: red;">' +
				'<p> {{ item.message }} </p>' +
			'</div>' +
		'</div>';

		
	return {
		restrict:'AE',
		transclude: true,
		template: template,
		controller: [
			'$scope',
			'$rootScope',
			'$timeout',
			'$flash',
			controller
		]
	}
} ]);