define([
    'modules/list/main/module'
], function (module) {
    'use strict';

    module.factory("ListFactory", ["$resource", "bzConfig", function($resource, bzConfig) {

        return $resource("list/", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/list/:id',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            childs: {
                method:"GET",
                url:bzConfig.api()+'/seo/childs',
                isArray:false
            },
            post: {
                method:"POST",
                url:bzConfig.api()+'/seo/list'
            },
            update: {
                method:"PUT",
                url:bzConfig.api()+'/list/:id',
                params: {
                    id:"@id"
                }
            },
            export: {
                method:"POST",
                url:bzConfig.api()+'/seo/export'
            }
        });
    }]);
});