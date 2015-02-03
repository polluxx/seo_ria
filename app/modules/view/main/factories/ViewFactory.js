define([
    'modules/view/main/module'
], function (module) {
    'use strict';

    module.factory("ViewFactory", ["$resource", "bzConfig", function($resource, bzConfig) {
        return $resource("view/", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/seo/doc',
                isArray:false
            },
            post: {
                method:"POST",
                url:bzConfig.api()+'/seo/doc'
            },
            update: {
                method:"PUT",
                url:bzConfig.api()+'/doc'
            }
        });
    }]);
});