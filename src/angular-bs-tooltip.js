angular.module('angular-bs-tooltip', [])
.directive('tooltip', ()=> ({
	restrict: 'A',
	scope: {
		tooltip: '@',
		tooltipPosition: '@?',
		tooltipContainer: '@?',
		tooltipTrigger: '@?',
		tooltipHtml: '@?'
	},
	link: function($scope, elem) {
		$scope.$watchGroup(['tooltip', 'tooltipPosition', 'tooltipContainer', 'tooltipTrigger'], ()=> {
			var isVisible = $(elem).siblings('.tooltip').length > 0; // Is the tooltip already shown?
			if ($(elem).hasClass('ng-tooltip')) $(elem).tooltip('destroy');

			$(elem)
				.tooltip({
					title: $scope.tooltip,
					placement: $scope.tooltipPosition || 'top',
					container: $scope.tooltipContainer == 'element' ? false : 'body',
					trigger: $scope.tooltipTrigger || 'hover',
					html: $scope.tooltipHtml || false,
					animation: false
				})
				.addClass('ng-tooltip');

			if (isVisible) $(elem).tooltip('show'); // Reshow the tooltip if we WERE using it before
		});
	},
}));
