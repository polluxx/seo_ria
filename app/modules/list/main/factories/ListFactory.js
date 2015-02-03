define([
    'modules/list/main/module'
], function (module) {
    'use strict';

    module.factory("ListFactory", ["$resource", function($resource) {
        var link = "http://avp.ria.com:8071";
        return $resource("list/", {}, {
            get: {
                method:"GET",
                url:link+'/list/:id',
                params: {
                    id:"@id"
                },
                isArray:false
            },
            childs: {
                method:"GET",
                url:link+'/seo/childs',
                isArray:false
            },
            post: {
                method:"POST",
                url:link+'/seo/list'
            },
            update: {
                method:"PUT",
                url:link+'/list/:id',
                params: {
                    id:"@id"
                }
            }
        });
    }]);
});