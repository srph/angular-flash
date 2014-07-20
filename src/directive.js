app.directive('flash', [function() {

	var controller = function($scope, $rootScope, $timeout, $flash) {
		// Removes the first one in the list every 5 seconds
		// until none remains
		var shift = function() {
			$timeout(function() {
				$flash.shift();
				$scope.list = $flash.list();
			}, $flash.lifetime(), true);
		}

		/**
		 * Close the clicked item
		 *
		 * @param 	{int} 	pos
		 * @return 	{void}
		 */
		$scope.close = function(pos) {
			$flash.remove(pos);
		}

		$rootScope.$on('$flashFired', function() {
			$scope.list = $flash.list();
			// Let the removal of every 0-index in the array begin
			shift();
		});
	};

	// Directive template
	var template =
		'<div class="ng-notification-flash-container">' +
			'<div ng-repeat="item in list" ng-click="close($index)"' +
			'class="ng-notification-flash-inner {{ item.class }}">' +
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