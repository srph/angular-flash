app.provider('flash', [function() {
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
	 * '_registry' directly to the 'bootstrap' (defaults)
	 * causes changes to '_registry' reflect on the 'bootstrap' array.
	 * 'angular.copy' may not be good performance-wise,
	 * however this avoids this problem.
	 *
	 * angular.copy MAY not be performant. This code is still
	 * being decided.
	 * 
	 * @var array
	 */
	this._registry = (function(_default) {
		return angular.copy(_default);
	})(this.bootstrap);

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
		var index = this._registry
			.map(function(cur) {
				return cur.type
			})
			.indexOf(type);

		return index;
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

		return ( angular.equals(index, -1) )
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
	this.overwrite = function(position, data) {
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
			 * @see
			 * _hasSimilarMessages()
			 * _isUnique
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
					}, this);
				} else if ( angular.isObject(data) ) {

					var position;

					// If the fired message has a nonexistent 'type', throw
					// an exception.
					if ( ( position = _this.isInRegistry(data.type) ) == -1 ) {
						throw new Error(data.type + ' is not defined in the registry!');
					}

					// If the message is not unique nor there are any
					// similar messages
					if ( !this._isUnique(data) ) {
						// Add the class of the provided type to the passed data
						data['class'] = _this._registry[position]['class'];

						// Push the flash to the list
						this.list().push(data);

						// Emit that fn is complete
						$rootScope.$emit('$flashFired');
					}
				} else {
					throw new Error('Not an object nor an array');
				}

				return this;
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
			flash._isUnique = function(data) {
				if ( angular.equals(data.unique, true) ) {
					if ( this._hasSimilarMessages(data.message) ) {
						return true;
					}
				}

				return false;
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
			flash._getSimilarMessages = function(message) {
				// This maps only the 'message' property in each object in
				// the array, allowing us to grab the index of the
				// fn argument with indexOf.
				var similarIndex = this.list()
					.map(function(cur) {
						return cur.message;
					})
					.indexOf(message);

				return similarIndex;
			}

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
			flash._hasSimilarMessages = function(message) {
				var similarIndex = this._getSimilarMessages(message);

				return ( angular.equals(similarIndex, -1) )
					? false
					: true;
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
					this._list = newList;
				}

				return this._list;
			};

			return flash;
		}
	];
}]);
