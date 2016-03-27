app.controller("SelectionModalController", function($scope, $uibModalInstance, selection) {
    $scope.choices = {
        selectionCount: selection.selectionObject.selections,
        //The options
        options: [],
        //If the option in options at the same index is selected
        selectedStates: []
    };

    $.each(selection.selectionObject.options, function(index, option) {
        $scope.choices.options[index] = option;
        $scope.choices.selectedStates[index] = false;
    });

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ok = function() {
        var selectedIndices = [];
        for (var i = 0; i < $scope.choices.options.length; i++) {
            if ($scope.choices.selectedStates[i] === true) {
                selectedIndices.push(i);
            }
        }
        selection.choose(selectedIndices);
        $uibModalInstance.close('complete');
    };
});
