define([
    'modules/user/list/module'
], function (module) {
    'use strict';

    module.factory('UserFactory', ['$resource', 'bzConfig', function($resource, bzConfig) {

        return $resource("cm/", {}, {
            send: {
                method:"POST",
                url:bzConfig.api()+'/cm/users',
                isArray:false
            },
            list: {
                method:"GET",
                url:bzConfig.api()+'/cm/users',
                isArray:false
            },
            permission: {
                method:"POST",
                url:bzConfig.api()+'/auth/permission',
                isArray:false
            }
        });

    }]);

});