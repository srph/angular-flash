app.service('FlashService', [
	'$rootScope',
	function($rootScope) {
		return {
			/**
			 * Lifetime of each flash
			 *
			 * @var 	int
			 */
			lifetime: 5000,
			
			/**
			 * List of registered names
			 *
			 * @var array
			 */
			registry: [],

			/**
			 * Checks if the passed type is already in the registry
			 *
			 * @param 	string 		name
			 * @return 	boolean
			 */
			isInRegistry: function(type) {
				return this.registry.indexOf(type) == -1;
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
			fire: function(type, message) {
				if( ! this.isInRegistry(name) ) {
					console.error('Given name is not in the registry!');
					return;
				}

				// Push the flash to the list
				this.list.push({ type: type, message: message});

				// Emit
				$rootScope.$emit('$flashFired');
			}

		}
	}
]);