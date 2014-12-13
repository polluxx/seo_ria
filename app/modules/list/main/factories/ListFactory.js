define([
    'modules/list/main/module'
], function (module) {
    'use strict';

    module.factory("ListFactory", ["$resource", function($resource) {
        return $resource("list/", {}, {
            get: {
                method:"GET",
                url:'/list/:id',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            post: {
                method:"POST",
                url:'/list'
            },
            update: {
                method:"PUT",
                url:'/list/:id',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});