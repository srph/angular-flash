var app = angular.module('angular-flash', []);
app.provider('$flash', [function() {
	/**
	 * Lifetime of each flash
	 *
	 * @var 	int
	 */
	this._lifetime = 2000;

	/**
	 * List of registered names
	 *
	 * @var array
	 */
	this._registry = [];

	/**
	 * Bootstrap configuration
	 */
	this.bootstrap = [
		{
			'type': 'success',
			'class': 'alert alert-success',
		},

		{
			'type': 'info',
			'class': 'alert alert-info',
		},

		{
			'type': 'warning',
			'class': 'alert alert-warning',
		},

		{
			'type': 'danger',
			'class': 'alert alert-danger',
		},
	];

	/**
	 * A get or setter for the lifetime of each flash
	 *
	 * @param 	int 	ms
	 * @return 	int
	 */
	this.lifetime = function(ms) {
		if ( ms !== undefined ) this._liftime = ms;

		return this._lifetime;
	}

	/**
	 * Checks if the passed type is already in the registry
	 *
	 * @param 	string 		name
	 * @return 	boolean
	 */
	this.isInRegistry = function(type) {
		// Stores the fetched index of the given type
		var index = this._registry.map(function(cur) { return cur.type }).indexOf(type);

		// Returns the position if the value of the index is -1 (see indexOf).
		// Otherwise, a false
		return !( index == -1 )
			? index
			: false;
	}

	/**
	 * Registers the name with its respective class to
	 * the service registry
	 *
	 * @param 	object|array 	data	Data?
	 * @return 	this
	 */
	this.register = function(data) {
		if ( data instanceof Array ) {
			// Recursion when the passed argument is an
			// array of objects
			angular.forEach(data, function(value, key) {
				this.register(value);
			}, _this);
		} else if ( typeof data === "object") {
			// If the given name has already been registered
			// in the registry, cancel operations and return an error
			if ( var position = this.isInRegistry(data.type) ) {
				return console.error('Given name is already in the registry');
			}

			// Push the data to the registry
			this._registry.push(data);
		} else {
			return console.error('Data is not an object!');
		}

		// Return the object for method chaining
		return this;
	}

	/**
	 * Overwrites an existing data on the given position
	 *
	 */
	this.overwrite = function(position, data)
	{
		this._registry[position] = data;
	}

	var _this = this;

	this.$get = [
		'$rootScope',
		function($rootScope) {
			var flash = {};

			/**
			 * List of messages being shown
			 *
			 * @var array
			 */
			flash._list = [];

			/**
			 * Get the set lifetime of each flash
			 *
			 * @var int
			 */
			flash.lifetime = function(ms) {
				return _this.lifetime(ms)
			};

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
						this.fire(value);
					}, _this);
				} else if ( typeof data === "object" ) {

					if ( ! _this.isInRegistry(data.type) ) {
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

			/**
			 * Removes everything in the list
			 *
			 * @return 	{void}
			 */
			flash.clean = function()
			{
				flash._list = [];
			};

			return flash;
		}
	];
}]);
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