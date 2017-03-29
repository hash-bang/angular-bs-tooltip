angular.module('app', [
	'angular-bs-tooltip',
])
	.controller('demoCtrl', function($scope, $interval) {
		$scope.time;
		$interval(()=> $scope.time = (new Date).toString(), 1000);
	})
