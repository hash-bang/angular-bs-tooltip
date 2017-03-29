angular-bs-tooltip
==================
AngularJS + Bootstrap tooltip support.


Installation
------------

1. Grab the NPM

```shell
npm install --save @momsfriendlydevco/angular-bs-tooltip
```


2. Install the required script + CSS somewhere in your build chain or include it in a HTML header:

```html
<script src="/libs/angular-bs-tooltip/dist/angular-bs-tooltip.min.js"/>
```


3. Include the router in your main `angular.module()` call:

```javascript
var app = angular.module('app', ['angular-bs-tooltip'])
```


4. Use somewhere in your template:

```html
<a class="btn btn-primary" tooltip="Hello World!">Top</a>
```


A demo is also available. To use this [follow the instructions in the demo directory](./demo/README.md).


API
===

Options
-------
The following options can be applied to any element to configure tooltips.


| Option              | Type      | Default | Description                                                                  |
|---------------------|-----------|---------|------------------------------------------------------------------------------|
| `tooltip`           | `string`  | `""`    | The content to display in the tooltip. This is rendered dynamically so Angular braces can be used. If `tooltip-html` is true the contents are rendered as HTML |
| `tooltip-position`  | `string`  | `top`   | Where to position the tooltip. Values are: `top`, `bottom`, `left`, `right`  |
| `tooltip-container` | `string`  | `body`  | The element to attach the tooltip to. Values are: `body`, `element`          |
| `tooltip-trigger`   | `string`  | `hover` | When to display the tooltip. Values are: `hover`, `focus`, `click`, `manual` |
| `tooltip-html`      | `boolean` | `false` | Whether to render the contents as HTML. If false, plain text is used         |
| `tooltip-show`      | `boolean` | `false` | Force the tooltip to display (this overrides `tooltip-trigger` if truthy)    |
| `tooltip-tether`    | `boolean` OR `number` | `false` | Use [Tether](http://tether.io) to dynamically pin the element. Use this (and include Tether in the project) if your underlying element changes position frequently. This setting is the time interval Tether should check for repositions (a value of `true` = `100`). NOTE: If you are just refreshing positions periodically use the `$scope.$broadcast('bs.tooltip.reposition')` instead |


Events
------
This directive also responds to the following broadcast events from the scope.
To use these simply broadcast from the parent scope *downwards* using `$broadcast()`. For example `$scope.$broadcast('bs.tooltip.reposition')` will force all tooltips below the calling controller to reposition themselves.


| Event                   | Description |
|-------------------------|-------------|
| `bs.tooltip.reposition` | Reposition all tooltips to their parent element if they are visible. If `tooltip-tether` is enabled on any tooltip it will be used for positioning, if not the tooltip is repositioned by Bootstrap |
