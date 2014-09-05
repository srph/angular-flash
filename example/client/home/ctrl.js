app.controller('ExCtrl', function ($scope, flash) {
	var random, messages, types;

	/**
	 * Randomize values
	 * 
	 * @return {[void]}
	 */
	function randomizer () {
		random = Math.ceil(Math.random() * (3) + 0);
		messages = [
			'Currently processing your request...',
			'Yes, milord!',
			'Justice is ours.',
			'I came in like a wrecking ball!'];
	}

	/**
	 * Initialize random values
	 */
	(function () {
		randomizer();
		types = ['danger', 'success', 'info', 'warning'];
	})();

	/**
	 * Normally flash a message
	 * 
	 * @return {[void]}
	 */
	$scope.flash = function () {
		// Randomize values
		randomizer();

		// Fire a flash messages
		flash.fire({ 'type': types[random], 'message':  messages[random] });
	};

	/**
	 * Flashes a unique message
	 * 
	 * @return {[void]}
	 */
	$scope.flashUnique = function () {
		// Randomize values
		randomizer();

		var type =  types[random],
			// message = 'If there is another message of same type and message, it will not flash until this one expires.';
			message = messages[random];

		flash.fire({ 'type': type, 'message': message, unique: true });
	};
});