app.directive('flash', function () {

	function FlashCtrl ($scope, $rootScope, $timeout, $log, flash) {
		var shiftTimeout;
		$scope.list = flash.list();
		// Removes the first one in the list every 5 seconds
		// until none remains
		var shift = function () {
			flash.shift();

			if(flash.list().length === 0) {
				$timeout.cancel(shiftTimeout);
			}

			shiftTimeout = $timeout(shift, flash.lifetime(), true);
		};

		/**
		 * Close the clicked item
		 *
		 * @param 	{int} 	pos
		 * @return 	{void}
		 */
		$scope.close = function(pos) {
			flash.remove(pos);
		};

		// $rootScope.$on('$flashFired', function() {
		// 	// Let the removal of every 0-index in the array begin
		// 	shift();
		// });

		$scope.$watch('list', function (newVal, oldVal) {
			if(oldVal.length === 0 && newVal.length === 1) {
				shiftTimeout = $timeout(shift, flash.lifetime(), true);
			}
		}, true);
	}

	// Directive template
	var template =
		'<div class="ng-notification-flash-container" role="alert">' +
			'<div ng-repeat="item in list"' +
			'class="ng-notification-flash-inner {{ item.class }}">' +
				'<button type="button" class="close" ng-click="close($index)">' +
					'<span aria-hidden="true">&times;</span>' +
					'<span class="sr-only">Close</span>' +
				'</button>' +
				'<p> {{ item.message }} </p>' +
			'</div>' +
		'</div>';

		
	return {
		restrict:'AE',
		transclude: true,
		template: template,
		controller: FlashCtrl
	};
});
