angular.module('angular-bs-tooltip', [])
.directive('tooltip', ()=> ({
	restrict: 'A',
	scope: {
		tooltip: '@?',
		tooltipPosition: '@?',
		tooltipContainer: '@?',
		tooltipTrigger: '@?',
		tooltipHtml: '<',
		tooltipShow: '<',
		tooltipTether: '<',
	},
	controller: function($scope, $element, $interval) {
		$scope.isVisible = false;

		$scope.isBS3 = /^3/.test($.fn.tooltip.Constructor.VERSION);
		$scope.isBS4 = /^4/.test($.fn.tooltip.Constructor.VERSION);

		/**
		* Rebuild the tooltip
		*/
		$scope.rebuild = ()=> {
			var elem = $($element);
			var isVisible = $scope.isVisible; // Local copy of the tooltip before we destroy it (or forced with tooltipShow)
			if (elem.hasClass('ng-tooltip')) {
				if ($scope.isBS3) {
					elem.tooltip('destroy');
				} else if ($scope.isBS4) {
					elem.tooltip('dispose');
				}
			}

			$scope.rebuildTether();

			elem
				.on('shown.bs.tooltip', ()=> $scope.isVisible = true)
				.on('hidden.bs.tooltip', ()=> $scope.isVisible = false)
				.tooltip({
					title: $scope.tooltip,
					placement: $scope.tooltipPosition || 'top',
					container: $scope.tooltipContainer == 'element' ? false : 'body',
					trigger: ($scope.tooltipShow === true || $scope.tooltipShow === false) ? 'manual' : $scope.tooltipTrigger || 'hover',
					html: !! $scope.tooltipHtml,
					animation: false,
					template:
						$scope.isBS3 ? `<div class="tooltip ng-tooltip-${$scope.$id}" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>`
						: $scope.isBS4 ? `<div class="tooltip ng-tooltip-${$scope.$id}" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`
						: `<div class="tooltip ng-tooltip-${$scope.$id}" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>`,
				})
				.addClass('ng-tooltip');

			if (
				$scope.tooltipShow === true ||
				($scope.tooltipShow !== false && isVisible)
			) elem.tooltip('show'); // Reshow the tooltip if we WERE using it before AND we dont have a forced hide
		};

		// Tethering {{{
		$scope.tether; // Tether object if we're using Tether mode
		$scope.tetherTimer;

		$scope.rebuildTether = ()=> {
			if ($scope.tooltipTether) { // Try to tether this tooltip using tether.js
				var elem = $($element)

				elem.one('shown.bs.tooltip', ()=> { // Wait until the tooltip is visible then tether to it
					if ($scope.isBS3) { // Attach BS3 / Tether to the element
						$scope.tether = new Tether({
							element: elem.data('bs.tooltip').$tip[0],
							target: elem[0],
							attachment:
								$scope.tooltipPosition == 'top' ? 'bottom middle' :
								$scope.tooltipPosition == 'left' ? 'center right' :
								$scope.tooltipPosition == 'right' ? 'center left' :
								$scope.tooltipPosition == 'bottom' ? 'top middle' :
								'bottom middle'
							,
							targetAttachment:
								$scope.tooltipPosition == 'top' ? 'top middle' :
								$scope.tooltipPosition == 'left' ? 'center left' :
								$scope.tooltipPosition == 'right' ? 'center right' :
								$scope.tooltipPosition == 'bottom' ? 'bottom middle' :
								'top middle'
						});

						if ($scope.tooltipTether === true || isFinite($scope.tooltipTether)) // Bind to refresh timer
							$scope.tetherTimer = $interval($scope.tether.position, $scope.tooltipTether === true ? 100 : $scope.tooltipTether);
					} else if ($scope.isBS4) {

						// If its a number
						if ($scope.tooltipTether === true || isFinite($scope.tooltipTether)) {
							var lastPos;
							var lastVisible;
							$scope.tetherTimer = $interval(()=> {
								var nowPos = elem.position();
								var nowVisible = elem.is(':visible');

								if (nowVisible && (lastPos === undefined || nowPos.left != lastPos.left || nowPos.top != lastPos.top)) {
									elem.tooltip('update');
									lastPos = nowPos;
								}

								if (lastVisible !== nowVisible) {
									elem.tooltip(nowVisible ? 'show' : 'hide');
									lastVisible = nowVisible;
								}
							}, $scope.tooltipTether === true ? 100 : $scope.tooltipTether);
						}
					}
				});

			} else if ($scope.tether) { // Destorying existing tether
				if ($scope.isBS3) {
					$scope.tether.destroy();
					$scope.tether = undefined;
				}
				$interval.cancel($scope.tetherTimer);
			}
		};
		// }}}

		// Setup a watcher to rebuild if any visual properties change
		$scope.$watchGroup(['tooltip', 'tooltipPosition', 'tooltipContainer', 'tooltipTrigger', 'tooltipHtml', 'tooltipShow', 'tooltipTether'], $scope.rebuild);

		// Respond to upstream events {{{
		$scope.$on('bs.tooltip.reposition', ()=> {
			if ($scope.tether) { // Using Tether - ask it to reposition
				$scope.tether.position();
			} else { // Not using tether - destroy and rebuild
				$scope.rebuild();
			}
		});
		// }}}

		// Respond to destruction {{{
		$scope.$on('$destroy', function() {
			if ($scope.tooltipTether && $scope.tether) $scope.tether.destroy();
			angular.element(`.ng-tooltip-${$scope.$id}`).remove();
			$($element).tooltip('destroy');
		});
		// }}}
	},
}));
