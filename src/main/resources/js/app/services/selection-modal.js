define(['angular', 'angular-ui', 'app/services/selection'], function(angular, angularui, selection){
	return function($scope, $uibModalInstance) {
        $scope.selectionsNeeded = selection.selectionObject.selections;
        //The options
        $scope.options = [];
        //If the option in options at the same index is selected
        $scope.selected= []

    $.each(selection.selectionObject.options, function(index, option) {
        $scope.options[index] = option;
        $scope.selected[index] = false;
    });

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ok = function() {
        var selectedIndices = [];
        for (var i = 0; i < $scope.options.length; i++) {
            if ($scope.selected[i] === true) {
                selectedIndices.push(i);
            }
        }
        selection.choose(selectedIndices);
        $uibModalInstance.close('complete');
    };
}});
