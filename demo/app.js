angular.module('app', [
	'angular-bs-tooltip',
])
	.controller('demoCtrl', function($scope, $interval) {
		$scope.time;
		$interval(()=> $scope.time = (new Date).toString(), 1000);

		$scope.config = {
			text: 'Hello <strong>World</strong>!',
			position: 'top',
			html: false,
			show: false,
		};
		$scope.positions = [
			{id: 'top', text: 'Top'},
			{id: 'right', text: 'Right'},
			{id: 'bottom', text: 'Bottom'},
			{id: 'left', text: 'Left'},
		];
	})
