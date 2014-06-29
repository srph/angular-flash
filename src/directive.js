app.directive('flash', [
	'$rootScope'
	function($rootScope) {
		return {
			restrict:'AE'
			transclude: true,
			template: '<div ng-transclude>' +
				'<ng-repeat="'
				'</div>'
			controller: [
				'$scope',
				'$rootScope',
				function($scope, $rootScope) {
					$scope.list = [];
				}
			]
		}
	}
]);