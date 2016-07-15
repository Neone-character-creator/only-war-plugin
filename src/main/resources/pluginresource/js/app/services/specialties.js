/**
 * Created by Damien on 7/9/2016.
 */
define(function () {
    return function ($resource, $q, placeholders) {
        var specialties = $q.defer();
        placeholders.then(function (placeholders) {
            specialties.resolve($resource("pluginresource/Character/Specialties.json").query().$promise.then(function (result) {
                return $q.all(result.map(placeholders.replace));
            }));
        });
        return specialties.promise.then(function (result) {
            return result.splice();
        });
    }
});