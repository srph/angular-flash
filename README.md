angular-flash
=============

An AngularJS module that allows you to flash a notification to the DOM.

## Installation

** Coming soon to Bower. **

** Simply include the script in your page **

```
<script type="text/javascript" src="/path/to/angular-flash.js"></script>
```

## Example ##

** Put the directive next to your markup body **. 

```
<body>
	<flash></flash>

	<!-- everything else -->
</body>
```

** Register your flash namespace and its respective class **. You may do this by injecting the $flashProvider during the configuration phase

```
app.config([
	'$flashProvider',
	function($flashProvider) {
		$flashProvider.register({ type: 'info', class: 'alert alert-info' });
	}
]);
```

You may also add more than one namespace by method-chaining since ```register()``` returns the ```$flashProvider``` instance.

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
```provider.

** Flashing it to the DOM **. This is pretty easy by simply using the ```fire()``` function included in the $flash provider.

Markup:

```
	<div ng-controller="HelloWorldCtrl">
		<button type="button" ng-click="fire()">Clickity Click</button>
	</div>
````

Script:

```
	app.controller('HelloWorldCtrl', [
		'$scope', 
		'$flash',
		function($scope, $flash) {
			$scope.fire = function() {
				flash.fire({ type: 'success', message: 'Hello World!' });
			}
		}
	]);
```


To use the included example:

Some requirements include,

- npm
- nodejs
- growl (windows users)

To test:

```
npm install -g bower
npm install -g gulp

## on the root directory
npm install
````

## Screenies ##

Currently unavailable

## Changelog ##

** v1.0 **

- Module is finally working. Out of the alpha phase