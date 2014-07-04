app.directive('flash', [function() {
	var controller = function($scope, $rootScope, $timeout, $flash) {
		// Removes the first one in the list every 5 seconds
		// until none remains
		var shift = function() {
			console.log('Shifting!');
			// An infinite loop broken only when none remains
			while($scope.list.length >= 1) {
				console.log('Attempting!');
				$timeout(function() {
					$flash._list.shift();
					$scope.list = $flash._list;
					$rootScope.$emit('$flashFiredRemoved');
					console.log($scope.list);
				}, $flash.lifetime(), true);
			}

			return;
		}

		$rootScope.$on('$flashFired', function() {
			console.log('Fired!');
			$scope.list = $flash._list;
			console.log($scope.list.length);
			// Let the removal of every 0-index in the array begin
			shift();
		});
	};

		
	return {
		restrict:'AE',
		transclude: true,
		template:
			'<div ng-repeat="item in list" class="{{ item.type }}" style="position: fixed;">' +
			'<p> {{ item.message }} </p>' +
			'</div>' ,
		controller: [
			'$scope',
			'$rootScope',
			'$timeout',
			'$flash',
			controller
		]
	}
} ]);