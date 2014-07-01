app.directive('flash', [
	'$rootScope'
	function($rootScope) {

		var controller = function($scope, $rootScope) {
			$scope.list = [];
			// Removes the first one in the list every 5 seconds
			// until none remains
			var shift = function() {
				// An infinite loop broken only when none remains
				while(true) {
					if ( ! FlashService.list.count ) break;

					$timeout(function() {
						FlashService.list.shift();
						$scope.list = FlashService.list;
						$rootScope.$on('$flashFiredRemoved');
					}, FlashService.lifetime, true);
				}

				return;
			}

			$rootScope.$on('$flashFired', function() {
				// Let the removal of every 0-index in the array begin
				pop();
			});
		}

		return {
			restrict:'AE'
			transclude: true,
			template:
				'<div ng-transclude>' +
					'<div ng-repeat="item in list" class="{{ item.type }}" style="position: fixed;">' +
						'<p> {{ item.message }} </p>'
					'</div>' +
				'</div>',
			controller: [
				'$scope',
				'$rootScope',
				controller
			]
		}
	}
]);