app.service('FlashService', [
	'$rootScope',
	function($rootScope) {
		return {
			/**
			 * List of registered names
			 *
			 * @var array
			 */
			registry: [],

			/**
			 * Registers the name with its respective class to
			 * the service registry
			 *
			 * @param 	object|array 	data	Data?
			 * @return 	this
			 */
			register: function(data) {
				// Recursion when the passed argument is an
				// array of objects
				if ( data instanceof Array ) {
					angular.foreach(i, (function(_this) {
						_this.register(i);
					}(this));
				} else {

					// If the given name has already been registered
					// in the registry, cancel operations,
					// return an error
					if ( this.isInRegistry(data.name) ) {
						console.error('Given name is already in the registry');
						return;
					}

					// Push the data to the registry
					this.registry.push(data);

					// Return the object for method chaining
				}
				return this;
			},

			/**
			 * Checks if the passed name is already in the registry
			 *
			 * @param 	string 		name
			 * @return 	boolean
			 */
			isInRegistry: function(name) {
				return this.registry.indexOf(name) == -1;
			}

			/**
			 * List of messages being shown
			 *
			 * @var array
			 */
			list: [],

			/**
			 * Flash the message right now
			 *
			 * @return 	this
			 */
			show: function(name, message) {
				if( ! this.isInRegistry(name) ) {
					console.error('Given name is not in the registry!');
					return;
				}

				// $rootScope.$emit('$flash');
				// this.list.push();
			}
		}
	}
]);