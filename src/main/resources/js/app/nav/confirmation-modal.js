define(function(){
	return function($scope, $uibModalInstance) {
	    $scope.ok = function() {
	        $uibModalInstance.close('ok');
	    };

	    $scope.cancel = function() {
	        $uibModalInstance.dismiss('cancel');
	    };
	};
})