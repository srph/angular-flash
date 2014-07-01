var app = angular.module('angular-flash', []);
app.provider('$flash', [
	function() {
		var flash = {};

		/**
		 * Lifetime of each flash
		 *
		 * @var 	int
		 */
		flash._lifetime = 5000;

		/**
		 * List of registered names
		 *
		 * @var array
		 */
		flash._registry = [],

		/**
		 * Checks if the passed type is already in the registry
		 *
		 * @param 	string 		name
		 * @return 	boolean
		 */
		flash._isInRegistry= function(type) {
			return this._registry.indexOf(type) == -1;
		}

		/**
		 * A get or setter for the lifetime of each flash
		 *
		 * @param 	int 	ms
		 * @return 	int
		 */
		flash.lifetime = function(ms) {
			var life = this._lifetime = this._lifetime || ms;
			return life;
		}

		/**
		 * Registers the name with its respective class to
		 * the service registry
		 *
		 * @param 	object|array 	data	Data?
		 * @return 	this
		 */
		flash.register = function(data) {

			if ( data instanceof Array ) {
				// Recursion when the passed argument is an
				// array of objects
				angular.forEach(data, function(value, key) {
					this.register(key);
				}, this);

			} else if ( typeof data === "object") {

				// If the given name has already been registered
				// in the registry, cancel operations and return an error
				if ( this._isInRegistry(data.name) ) {
					return console.error('Given name is already in the registry');
				}

				// Push the data to the registry
				this._registry.push(data);

			} else {
				return console.error('Data is not an object!');
			}

			// Return the object for method chaining
			return this;
		};

		/**
		 * List of messages being shown
		 *
		 * @var array
		 */
		flash._list = [];

		/**
		 * Flash the message right now
		 *
		 * @param 	object 	data
		 * @return 	this
		 */
		flash.fire = function(data) {
			if ( data instanceof Array )  {
				// Recursion when the passed argument is an
				// array of objects
				angular.forEach(data, function(value, key) {
					this.register(key);
				}, this);
			} else if ( typeof data === "object" ) {
				if ( ! this._isInRegistry(name) ) {
					return console.error('Given name is not in the registry!');
				}

				// Push the flash to the list
				this._list.push(data);

				// Emit
				$rootScope.$emit('$flashFired');
			} else {
				return console.error('Not an object nor an array');
			}

			return this;
		};

		this.$get = [
			'$rootScope',
			function($rootScope) {
				return flash;
			}
		];
	}
]);
app.directive('flash', [
	function() {
		var controller = [
			'$scope',
			'$rootScope',
			'$flash',
			function($scope, $rootScope, $flash) {
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
					shift();
				});
		}];

		return {
			restrict:'AE'
			transclude: true,
			template:
				'<div ng-transclude>' +
					'<div ng-repeat="item in list" class="{{ item.type }}" style="position: fixed;">' +
						'<p> {{ item.message }} </p>'
					'</div>' +
				'</div>',
			controller: controller
		}
	}
]);