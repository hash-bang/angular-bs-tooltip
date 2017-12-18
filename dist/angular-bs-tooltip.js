'use strict';

angular.module('angular-bs-tooltip', []).directive('tooltip', function () {
	return {
		restrict: 'A',
		scope: {
			tooltip: '@?',
			tooltipPosition: '@?',
			tooltipContainer: '@?',
			tooltipTrigger: '@?',
			tooltipHtml: '<',
			tooltipShow: '<',
			tooltipTether: '<'
		},
		controller: ['$scope', '$element', '$interval', function controller($scope, $element, $interval) {
			$scope.isVisible = false;

			/**
   * Rebuild the tooltip
   */
			$scope.rebuild = function () {
				var elem = $($element);
				var isVisible = $scope.isVisible; // Local copy of the tooltip before we destroy it (or forced with tooltipShow)
				if (elem.hasClass('ng-tooltip')) elem.tooltip('destroy');

				$scope.rebuildTether();

				elem.on('shown.bs.tooltip', function () {
					return $scope.isVisible = true;
				}).on('hidden.bs.tooltip', function () {
					return $scope.isVisible = false;
				}).tooltip({
					title: $scope.tooltip,
					placement: $scope.tooltipPosition || 'top',
					container: $scope.tooltipContainer == 'element' ? false : 'body',
					trigger: $scope.tooltipShow === true || $scope.tooltipShow === false ? 'manual' : $scope.tooltipTrigger || 'hover',
					html: !!$scope.tooltipHtml,
					animation: false,
					template: '<div class="tooltip ng-tooltip-' + $scope.$id + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
				}).addClass('ng-tooltip');

				if ($scope.tooltipShow === true || $scope.tooltipShow !== false && isVisible) elem.tooltip('show'); // Reshow the tooltip if we WERE using it before AND we dont have a forced hide
			};

			// Tethering {{{
			$scope.tether; // Tether object if we're using Tether mode
			$scope.tetherTimer;

			$scope.rebuildTether = function () {
				if ($scope.tooltipTether) {
					// Try to tether this tooltip
					var elem = $($element);

					elem.one('shown.bs.tooltip', function () {
						// Wait until the tooltip is visible then tether to it
						$scope.tether = new Tether({
							element: elem.data('bs.tooltip').$tip[0],
							target: elem[0],
							attachment: $scope.tooltipPosition == 'top' ? 'bottom middle' : $scope.tooltipPosition == 'left' ? 'center right' : $scope.tooltipPosition == 'right' ? 'center left' : $scope.tooltipPosition == 'bottom' ? 'top middle' : 'bottom middle',

							targetAttachment: $scope.tooltipPosition == 'top' ? 'top middle' : $scope.tooltipPosition == 'left' ? 'center left' : $scope.tooltipPosition == 'right' ? 'center right' : $scope.tooltipPosition == 'bottom' ? 'bottom middle' : 'top middle'
						});

						// If its a number
						if ($scope.tooltipTether === true || isFinite($scope.tooltipTether)) $scope.tetherTimer = $interval($scope.tether.position, $scope.tooltipTether === true ? 100 : $scope.tooltipTether);
					});
				} else if ($scope.tether) {
					// Destorying existing tether
					$scope.tether.destroy();
					$scope.tether = undefined;
					$interval.cancel($scope.tetherTimer);
				}
			};
			// }}}

			// Setup a watcher to rebuild if any visual properties change
			$scope.$watchGroup(['tooltip', 'tooltipPosition', 'tooltipContainer', 'tooltipTrigger', 'tooltipHtml', 'tooltipShow', 'tooltipTether'], $scope.rebuild);

			// Respond to upstream events {{{
			$scope.$on('bs.tooltip.reposition', function () {
				if ($scope.tether) {
					// Using Tether - ask it to reposition
					$scope.tether.position();
				} else {
					// Not using tether - destroy and rebuild
					$scope.rebuild();
				}
			});
			// }}}

			// Respond to destruction {{{
			$scope.$on('$destroy', function () {
				if ($scope.tooltipTether && $scope.tether) $scope.tether.destroy();
				angular.element('.ng-tooltip-' + $scope.$id).remove();
				$($element).tooltip('destroy');
			});
			// }}}
		}]
	};
});