define([
    'modules/post/list/module'
], function (module) {
    'use strict';

    module.factory('PostFactory', ['$resource', 'bzConfig', function($resource, bzConfig) {

        return $resource("cm/", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/cm/post/:id',
                isArray:false
            },
            send: {
                method:"POST",
                url:bzConfig.api()+'/cm/post',
                isArray:false
            },
            remove: {
                method:"DELETE",
                url:bzConfig.api()+'/cm/post',
                isArray:false
            },
            list: {
                method:"GET",
                url:bzConfig.api()+'/cm/postlist',
                isArray:false
            },
            tags: {
                method:"GET",
                url:bzConfig.api()+'/cm/auto-tags',
                isArray:false
            }
        });

    }]);

});