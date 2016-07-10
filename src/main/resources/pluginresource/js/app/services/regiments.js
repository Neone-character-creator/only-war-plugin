/**
 * Created by Damien on 7/9/2016.
 */
define(function () {
    return function ($resource, $q, placeholders) {
        return placeholders.then(function (placeholders) {
            var regiments = $resource("pluginresource/Regiment/Regiments.json").query().$promise.then(function (result) {
                return $q.all(result.map(placeholders.replace));
            });
            return regiments;
        });
    }
});