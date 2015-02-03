define([
    'modules/view/robots/module'
], function (module) {
    'use strict';

    module.factory("RobotsFactory", ["$resource", "bzConfig", function($resource, bzConfig) {
        return $resource("robots/", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/seo/robots',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            update: {
                method:"PUT",
                url:bzConfig.api()+'/seo/robots',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});