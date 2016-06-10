define(function(){
	return function($scope, $uibModalInstance, selection) {
        $scope.selectionsNeeded = selection.selectionObject.selections;
        //The options
        $scope.options = selection.selectionObject.options;
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
