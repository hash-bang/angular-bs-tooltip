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
			tooltipShow: '<'
		},
		controller: ["$scope", "$element", function controller($scope, $element) {
			$scope.isVisible = false;

			$scope.$watchGroup(['tooltip', 'tooltipPosition', 'tooltipContainer', 'tooltipTrigger', 'tooltipHtml', 'tooltipShow'], function () {
				var elem = $($element);
				var isVisible = $scope.tooltipShow !== undefined && $scope.tooltipShow !== null ? $scope.tooltipShow : $scope.isVisible; // Local copy of the tooltip before we destroy it (or forced with tooltipShow)
				if (elem.hasClass('ng-tooltip')) elem.tooltip('destroy');

				if (!$scope.tooltip) return; // No tooltip set - don't bother with setup

				elem.on('shown.bs.tooltip', function () {
					return $scope.isVisible = true;
				}).on('hidden.bs.tooltip', function () {
					return $scope.isVisible = false;
				}).tooltip({
					title: $scope.tooltip,
					placement: $scope.tooltipPosition || 'top',
					container: $scope.tooltipContainer == 'element' ? false : 'body',
					trigger: $scope.tooltipShow ? 'manual' : $scope.tooltipTrigger || 'hover',
					html: !!$scope.tooltipHtml,
					animation: false
				}).addClass('ng-tooltip');

				if (isVisible) elem.tooltip('show'); // Reshow the tooltip if we WERE using it before
			});
		}]
	};
});