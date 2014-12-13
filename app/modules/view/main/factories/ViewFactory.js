define([
    'modules/view/main/module'
], function (module) {
    'use strict';

    module.factory("ViewFactory", ["$resource", function($resource) {
        return $resource("view/", {}, {
            get: {
                method:"GET",
                url:'/view/:id',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            post: {
                method:"POST",
                url:'/view/:id',
                params: {
                    id:"@id"
                }
            },
            update: {
                method:"PUT",
                url:'/view/:id',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});