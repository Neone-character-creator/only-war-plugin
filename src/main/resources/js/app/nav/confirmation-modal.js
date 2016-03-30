require(['app'], function(app){
	app.controller("ConfirmationController", function($scope, $uibModalInstance) {
	    $scope.ok = function() {
	        $uibModalInstance.close('ok');
	    };

	    $scope.cancel = function() {
	        $uibModalInstance.dismiss('cancel');
	    };
	});
})