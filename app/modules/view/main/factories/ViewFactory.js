define([
    'modules/view/main/module'
], function (module) {
    'use strict';

    module.factory("ViewFactory", ["$resource", function($resource) {
        return $resource("view/", {}, {
            get: {
                method:"GET",
                url:'http://seo.ria.local:8081/seo/doc',
                isArray:false
            },
            post: {
                method:"POST",
                url:'http://seo.ria.local:8081/seo/doc'
            },
            update: {
                method:"PUT",
                url:'http://seo.ria.local:8081/doc'
            }
        });
    }]);
});