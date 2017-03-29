angular.module('angular-bs-tooltip', [])
.directive('tooltip', function() {
	return {
		scope: {
			tooltip: '@',
			tooltipPosition: '@?',
			tooltipContainer: '@?',
			tooltipTrigger: '@?',
			tooltipHtml: '@?'
		},
		restrict: 'A',
		link: function($scope, elem) {
			$scope.$watch('tooltip + tooltipPosition + tooltipContainer + tooltipTrigger', function() {
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

				if (isVisible) // Reshow the tooltip if we WERE using it before
					$(elem).tooltip('show');
			});
		}
	}
});
