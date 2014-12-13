define([
    'modules/view/robots/module'
], function (module) {
    'use strict';

    module.factory("RobotsFactory", ["$resource", function($resource) {
        return $resource("robots/", {}, {
            get: {
                method:"GET",
                url:'/robots/:id',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            update: {
                method:"PUT",
                url:'/robots/:id',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});