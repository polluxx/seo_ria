define([
    'modules/dashboard/main/module'
], function (module) {
    'use strict';

    module.factory('DashboardFactory', ['$resource', 'bzConfig', function($resource, bzConfig) {

        return $resource("cm/", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/cm/post/:id',
                isArray:false
            },
            list: {
                method:"GET",
                url:bzConfig.api()+'/cm/postlist',
                isArray:false
            }
        });

    }]);

});