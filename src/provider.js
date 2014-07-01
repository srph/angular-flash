app.provider('$flashProvider', [
	function() {
		/**
		 * A get or setter for the lifetime of each flash
		 *
		 * @param 	int 	ms
		 * @return 	int
		 */
		var lifetime = function(ms) {
			var life = FlashService.lifetime = 5000 || ms;
			return life;
		}

		/**
		 * Registers the name with its respective class to
		 * the service registry
		 *
		 * @param 	object|array 	data	Data?
		 * @return 	this
		 */
		var register = function(data) {

			if ( data instanceof Array ) {
				// Recursion when the passed argument is an
				// array of objects
				angular.forEach(data, function(value, key) {
					this.register(key);
				}, this);

			} else if ( typeof data === "object") {

				// If the given name has already been registered
				// in the registry, cancel operations and return an error
				if ( service.isInRegistry(data.name) ) {
					return console.error('Given name is already in the registry');
				}

				// Push the data to the registry
				service.registry.push(data);

			} else {
				return console.error('Data is not an object!');
			}

			// Return the object for method chaining
			return this;

		};

		this.$get = [
			'$rootScope',
			'FlashService',
			function($rootScope, FlashService) {

				return {
					lifetime: lifetime
					register: register
				};

			}
		];
	}
]);