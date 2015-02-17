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
            rewrite: {
                method:"POST",
                url:bzConfig.api()+'/seo/rewrite'
            },
            update: {
                method:"PUT",
                url:bzConfig.api()+'/doc'
            },
            vars: {
                method:"GET",
                url:bzConfig.api()+'/seo/vars'
            }
        });
    }]);
});