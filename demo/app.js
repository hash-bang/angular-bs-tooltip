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
			tether: false,
			show: undefined,
			jumpy: false,
		};

		// .config.jumpy {{{
		$scope.jumpTimer;
		$scope.$watch('config.jumpy', ()=> {
			if (!$scope.config.jumpy) return $interval.cancel($scope.jumpTimer);

			$scope.jumpTimer = $interval(()=> $('#target').css({
				top: (Math.random() * 100) / 2,
				left: (Math.random() * 100) / 2,
			}), 700);
		});

		$scope.jumpRefresh = ()=> $scope.$broadcast('bs.tooltip.reposition');
		// }}}
	})
