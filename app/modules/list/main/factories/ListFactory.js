define([
    'modules/list/main/module'
], function (module) {
    'use strict';

    module.factory("ListFactory", ["$resource", function($resource) {
        return $resource("list/", {}, {
            get: {
                method:"GET",
                url:'http://seo.ria.local:8081/list/:id',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            childs: {
                method:"GET",
                url:'http://seo.ria.local:8081/seo/childs',
                isArray:false
            },
            post: {
                method:"POST",
                url:'http://seo.ria.local:8081/seo/list'
            },
            update: {
                method:"PUT",
                url:'http://seo.ria.local:8081/list/:id',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});