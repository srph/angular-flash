var app = angular.module('angular-flash', []);
app.provider('flash', function() {
	/**
	 * Overwrites an existing data on the given position
	 *
	 */
	var _overwrite = function(position, data) {
		_registry[position] = data;
	};

	/**
	 * Bootstrap classes defaults
	 * @type {Array}
	 */
	var _bootstrapDefaults = [
		{
			'type': 'success',
			'class': 'alert alert-success alert-dismissible'
		},

		{
			'type': 'info',
			'class': 'alert alert-info alert-dismissible'
		},

		{
			'type': 'warning',
			'class': 'alert alert-warning alert-dismissible'
		},

		{
			'type': 'danger',
			'class': 'alert alert-danger alert-dismissible'
		}
	];

	/**
	 * List of registered names
	 * 
	 * '_registry' directly to the 'bootstrap' (defaults)
	 * causes changes to '_registry' reflect on the 'bootstrap' array.
	 * 'angular.copy' may not be good performance-wise,
	 * however this avoids this problem.
	 *
	 * angular.copy MAY not be performant. This code is still
	 * being decided.
	 * 
	 * @type {Array}
	 */
	var _registry = (function(_defaults) {
		return angular.copy(_defaults);
	})(_bootstrapDefaults);

	/**
	 * The actual "register" implementation
	 * 
	 * @param  {[type]} data
	 * @return {[type]}
	 */
	var _register = function (data) {
		var position;
		// If the given name has already been registered
		// in the registry, cancel operations and return an error
		if ( ( position = _isInRegistry(data.type) ) ) {
			// return console.error('Given name is already in the registry');
			_overwrite(position, data);
		}

		// Push the data to the registry
		_registry.push(data);
	};

	/**
	 * Returns the position of the type
	 *
	 * @param 	string 		name
	 * @return 	int
	 */
	var _getPositionOfType = function(type) {
		// Stores the fetched index of the given type
		var index = _registry
			.map(function(cur) {
				return cur.type;
			})
			.indexOf(type);

		return index;
	};

	/**
	 * Returns the data of the type
	 *
	 * If the type does not exist, it returns the -1 value.
	 * Otherwise, returns the registry data.
	 *
	 * @param 	{str} 	type
	 * @return 	{int}
	 */
	var _getDataOfType = function(type) {
		var index = _getPositionOfType(type),

			// Reflects the position of the type
			// Alias
			resultNegative = angular.equals(index, -1);

		return ( resultNegative ) ? index : _registry[index];
	};

	/**
	 * Checks if the passed type is already in the registry.
	 * Alias to the getPositionOfType function
	 *
	 * @param 	string 		name
	 * @return 	int
	 */
	var _isInRegistry = function(type) {
		return _getPositionOfType(type);
	};

	/**
	 * Lifetime of each flash
	 *
	 * @var 	int
	 */
	var _lifetime = 10000;

	/**
	 * List of registered names
	 * 
	 * @see
	 * _registry
	 * 
	 * @type {Array}
	 */
	this._registry = _registry;

	/**
	 * A get or setter for the lifetime of each flash
	 *
	 * @param 	int 	ms
	 * @return 	int
	 */
	this.lifetime = function(ms) {
		if ( angular.isDefined(ms) ) {
			_lifetime = ms;
		}

		return _lifetime;
	};

	/**
	 * Registers the name with its respective class to
	 * the service registry
	 *
	 * @see
	 * _overwrite
	 *
	 * @param 	object|array 	data	Data?
	 * @return 	this
	 */
	this.register = function(data) {
		if ( angular.isArray(data) ) {
			// Recursion when the passed argument is an
			// array of objects
			angular.forEach(data, function(value, key) {
				this.register(value);
			}, this);
		} else if ( angular.isObject(data) ) {
			_register(data);
		} else {
			throw new Error('Registered data is not an object!');
		}

		// Return the object for method chaining
		return this;
	};

	// Reference to our this
	var _this = this;

	this.$get = ["$rootScope", function($rootScope) {
		var flash = {};

		/**
		 * List of messages being shown
		 *
		 * @var array
		 */
		var _list = [];

		/**
		 * Gets the class of the provided position in the registry
		 * 
		 * @param  {[int]} position
		 * @return {[type]}
		 */
		var _getClass = function (position) {
			position = parseInt(position, 10);

			return _this._registry[position].class;
		};

		/**
		 *
		 * @function
		 * This fetches all similar messages
		 *
		 * @param
		 * int 		message
		 *
		 * @return
		 * {bool}|{int}
		 */
		var _getSimilarMessages = function(message) {
			// This maps only the 'message' property in each object in
			// the array, allowing us to grab the index of the
			// fn argument with indexOf.
			var similarIndex = flash.list()
				.map(function(cur) {
					return cur.message;
				})
				.indexOf(message);

			return similarIndex;
		};

		/**
		 *
		 * @see
		 * ._getSimilarMessages()
		 *
		 * @param
		 * int 		message
		 *
		 * @return
		 * bool
		 */
		var _hasSimilarMessages = function(message) {
			var similarIndex = _getSimilarMessages(message);

			return ( angular.equals(similarIndex, -1) )	? false : true;
		};

		/**
		 *
		 * @function
		 * Checks if the unique property of the given data is set to true
		 *
		 * @see
		 * ._hasSimilarMessages()
		 *
		 * @return
		 * bool
		 */
		var _isUnique = function(data) {
			if ( angular.equals(data.unique, true) ) {
				if ( _hasSimilarMessages(data.message) ) {
					return true;
				}
			}

			return false;
		};

		/**
		 * The actual "fire" / message flash implementation
		 *
		 * @see
		 * _isUnique()
		 * this.isInRegistry()
		 * flash.list()
		 * 
		 * @param  {[object]} data
		 * @return {[void]}
		 */
		var _fire = function (data) {
			var position;

			// Alias to the type property of the passed data
			// for the sake of semantics
			var type = data.type;

			// If the fired message has a nonexistent 'type', throw
			// an exception.
			if ( ( position = _isInRegistry(type) ) == -1 ) {
				throw new Error(data.type + ' is not defined in the registry!');
			}

			// If the message is not unique nor there are any
			// similar messages
			if ( !_isUnique(data) ) {
				// Add the class of the provided type to the passed data
				data.class = _getClass(position);

				// Push the flash to the list
				flash.list().push(data);

				// Emit that fn is complete
				$rootScope.$emit('$flashFired');
			}
		};

		/**
		 * Get the set lifetime of each flash
		 *
		 * @var int
		 */
		flash.lifetime = function() {
			return _this.lifetime();
		};

		/**
		 * Flash the message
		 *
		 * @see
		 * _fire
		 *
		 * @param 	object 	data
		 * @return 	this
		 */
		flash.fire = function(data) {
			// Recursion when the passed argument is an array of objects.
			// If not but and object, fire the message.
			// Otherwise, throw an exception.
			if ( angular.isArray(data) )  {
				angular.forEach(data, function(value, key) {
					this.fire(value);
				}, this);
			} else if ( angular.isObject(data) ) {
				_fire(data);
			} else {
				throw new Error('Data is neither an object nor an array');
			}
				
			// Return the instance for method chaining
			return this;
		};

		/**
		 * Removes a data in the given position of the list
		 *
		 * @param 	{int} 	pos
		 * @return 	{void}
		 */
		flash.remove = function(pos) {
			this.list().splice(pos, 1);

			$rootScope.$emit('$flashFireRemoved');
		};

		/**
		 * Removes everything in the list
		 *
		 * @return 	{void}
		 */
		flash.clean = function() {
			this.list([]);
		};

		/**
		 * Shifts the list. This avoids direct shifting
		 * of the list (also for encapsulation)
		 *
		 * @return 	{void}
		 */
		flash.shift = function() {
			this.list().shift();

			$rootScope.$emit('$flashFiredRemoved');
		};

		/**
		 * A setter/getter for the _list variables (encapsulation)
		 *
		 * @return 	{array}
		 */
		flash.list = function(newList) {
			if ( angular.isDefined(newList) ) {
				// If the passed argument is not an array,
				// throw an exception
				if ( ! angular.isArray(newList) ) {
					throw new Error('New _list is not an array!');
				}

				// Assign the passed argument to _list
				_list = angular.copy(newList);
			}

			return _list;
		};

		return flash;
	}];
});
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
			if(oldVal.length == 0 && newVal.length == 1) {
				shiftTimeout = $timeout(shift, flash.lifetime(), true);
			}


			$log.info('Old:' + oldVal.length);
			$log.info('New:' + newVal.length);
		}, true);
	}
	FlashCtrl.$inject = ["$scope", "$rootScope", "$timeout", "$log", "flash"];;

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
