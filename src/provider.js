app.provider('$flash', [function() {
	/**
	 * Lifetime of each flash
	 *
	 * @var 	int
	 */
	this._lifetime = 10000;

	/**
	 * Bootstrap configuration
	 */
	this.bootstrap = [
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
	 * @var array
	 */
	this._registry = this.bootstrap;

	/**
	 * A get or setter for the lifetime of each flash
	 *
	 * @param 	int 	ms
	 * @return 	int
	 */
	this.lifetime = function(ms) {
		if ( angular.isDefined(ms) ) {
			this._lifetime = ms;
		}

		return this._lifetime;
	}

	/**
	 * Returns the position of the type
	 *
	 * @param 	string 		name
	 * @return 	int
	 */
	this.getPositionOfType = function(type) {
		// Stores the fetched index of the given type
		var index = this._registry.map(function(cur) { return cur.type }).indexOf(type);

		// Returns the position if the value of the index is -1 (see indexOf).
		// Otherwise, a false
		return !( index == -1 )
			? index
			: -1;
	}

	/**
	 * Returns the data of the type
	 * Almost an alias to the getPositionOfType function
	 *
	 * -1 = false
	 * Otherwise, true
	 *
	 * @param 	{str} 	type
	 * @return 	{int}
	 */
	this.getDataOfType = function(type) {
		var index = this.getPositionOfType(type);

		return (index == -1)
			? index
			: this._registry[index];
	}

	/**
	 * Checks if the passed type is already in the registry.
	 * Alias to the getPositionOfType function
	 *
	 * @param 	string 		name
	 * @return 	int
	 */
	this.isInRegistry = function(type) {
		return this.getPositionOfType(type);
	}

	/**
	 * Registers the name with its respective class to
	 * the service registry
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
			var position;
			// If the given name has already been registered
			// in the registry, cancel operations and return an error
			if ( position = this.isInRegistry(data.type) ) {
				// return console.error('Given name is already in the registry');
				this.overwrite(position, data);
			}

			// Push the data to the registry
			this._registry.push(data);
		} else {
			throw new Error('Registered data is not an object!');
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

	// Reference to our this
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
			flash.lifetime = function() {
				return _this.lifetime()
			};

			/**
			 * Flash the message right now
			 *
			 * @param 	object 	data
			 * @return 	this
			 */
			flash.fire = function(data) {
				if ( angular.isArray(data) )  {
					// Recursion when the passed argument is an
					// array of objects
					angular.forEach(data, function(value, key) {
						this.fire(value);
					}, _this);
				} else if ( angular.isObject(data) ) {

					var position;

					if ( ( position = _this.isInRegistry(data.type) ) == -1 ) {
						throw new Error(data.type + ' is not in the registry!');
					}

					// Add the class of the provided type to the passed data
					data.class = _this._registry[position].class;

					// Push the flash to the list
					this._list.push(data);

					// Emit
					$rootScope.$emit('$flashFired');
				} else {
					throw new Error('Not an object nor an array');
				}

				return this;
			};

			/**
			 * Removes a data in the given position of the list
			 *
			 * @param 	{int} 	pos
			 * @return 	{void}
			 */
			flash.remove = function(pos) {
				this._list.splice(pos, 1);

				$rootScope.$emit('$flashFireRemoved');
			}

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
				this._list.shift();

				$rootScope.$emit('$flashFiredRemoved');
			}

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
					this._list = newList;
				}

				return this._list;
			}

			return flash;
		}
	];
}]);
