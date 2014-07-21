angular-flash
=============

An AngularJS module that allows you to flash a notification to the DOM.

The primary reason that this was created was due to other modules, although superior in terms of usability and stability, lacks documentation which makes it difficult for others to help, maintain, and improve the tool.

## Installation

*Coming soon to Bower.*

Simply include the script in your page:

```
<script type="text/javascript" src="/path/to/angular-flash.js"></script>
```

## Instructions ##

**Put the directive next to your markup body**. 

```
<body>
	<flash></flash>

	<!-- everything else -->
</body>
```

**By default,** we register the 4 basic types (info, sucess, error warning) with a respective Twitter Bootstrap alert class (alert alert-info, ...). **If you have no intentions of adding new types or overwriting the existing ones**, then do not bother with any of the configurations.

**Flashing it to the DOM**. This is pretty easy by simply using the ```fire()``` function included in the $flash provider.

html:

```
<head>
	<!-- stylesheet -->
	<link href="/path/to/angular-flash.css" type="text/css" rel="stylesheet">
</head>

<body>
	<div ng-controller="HelloWorldCtrl">
		<button type="button" ng-click="fire()">Clickity Click</button>
	</div>
</body>
````

js:

```javascript
app.controller('HelloWorldCtrl', [
	'$scope', 
	'$flash',
	function($scope, $flash) {
		$scope.fire = function() {
			$flash.fire({ type: 'success', message: 'Hello World!' });
		}
	}
]);
```

To assign the lifetime of each message, you may use the ```lifetime()``` function and pass the amount of milliseconds. By default, the lifetime is set to 10s.

```javascript
app.config([
	'$flashProvider',
	function($flashProvider) {
		// This will make the lifetime of each message to 5 seconds
		var ms = 5000;
		$flashProvider.lifetime(ms);
	}
]);
```

Yoy **may** also **register your custom flash type with its respective class**. You may do this by injecting the $flashProvider during the configuration phase, and using the ```register()``` fn.

```javascript
app.config([
	'$flashProvider',
	function($flashProvider) {
		$flashProvider.register({ type: 'info', class: 'alert alert-info' });
	}
]);
```

You may also add more than one type by method-chaining since ```register()``` returns the ```$flashProvider``` instance.

```
app.config([
	'$flashProvider',
	function($flashProvider) {
		$flashProvider
			.register({ type: 'info', class: 'alert alert-info' })
			.register({ type: 'success', class: 'alert alert-success' })
			.register({ type: 'error', class: 'alert alert-danger' })
			.register({ type: 'warning', class: 'alert alert-warning' });
	}
]);
```

It is also possible to it in another way. By using arrays of objects instead.

```
app.config([
	'$flashProvider',
	function($flashProvider) {
		$flashProvider
			.register([
				{ type: 'info', class: 'alert alert-info' },
				{ type: 'success', class: 'alert alert-success' },
				{ type: 'error', class: 'alert alert-danger' },
				{ type: 'warning', class: 'alert alert-warning' }
			]);
	}
]);
```

## Example ##

To use the included example:

Some requirements include:

- npm
- nodejs
- growl (windows users)

To test (on the root directory):

```
npm install -g bower
npm install -g gulp
npm install

gulp
```

## Screenies ##

Currently unavailable

## To do ##

- [ ] Write tests
- [ ] Persistence
- [x] 'event' ng-click each notification in the list
- [ ] Custom templates
- [ ] ng-animate

For more updates, do check the [Trello](https://trello.com/b/5soqLral/ng-flash)

## Changelog ##

**v1.1**
- Fixed flash.fire function when passed an array of objects
- Clean function
- Updated README (added gulp task to run)
- Updated 
- Overwrites when a type registered already exists instead of returning an error
- Exceptions instead of console.error

- Added shift function instead of directly shifting the list
- Added setter/getter function for the _list (encapsulation)
- Added close function (close a flash)

- Added bootstrap to the example
- Added CSS file
- Updated instructions

**v1.0**
- Module is finally working. Out of the alpha phase
