app.factory("fatePointRollResults", function($resource, $q) {
    var defer = $q.defer();
    $resource("Character/fatepoints.json").get().$promise.then(function(data) {
        defer.resolve(data);
    });
    return defer.promise;
})