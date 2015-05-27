define([
    'modules/comments/list/module'
], function (module) {
    'use strict';

    module.factory('CommentsFactory', ['$resource', 'bzConfig', function($resource, bzConfig) {

        return $resource(bzConfig.api()+"/cm/comment", {}, {
            send: {
                method:"POST",
                isArray:false
            },
            remove: {
                method:"DELETE",
                isArray:false
            },
            list: {
                method:"GET",
                isArray:false
            }
        });
    }]);

});