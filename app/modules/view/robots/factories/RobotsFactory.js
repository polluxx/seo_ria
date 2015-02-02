define([
    'modules/view/robots/module'
], function (module) {
    'use strict';

    module.factory("RobotsFactory", ["$resource", function($resource) {
        return $resource("robots/", {}, {
            get: {
                method:"GET",
                url:'http://seo.ria.local:8081/seo/robots',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            update: {
                method:"PUT",
                url:'http://seo.ria.local:8081/seo/robots',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});