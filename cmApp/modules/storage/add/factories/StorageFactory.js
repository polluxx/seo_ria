define([
    'modules/storage/add/module'
], function (module) {
    'use strict';

    module.factory('StorageFactory', ['$resource', 'bzConfig', function($resource, bzConfig) {

        return $resource("cm/storage", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/cm/idea/:id',
                isArray:false
            },
            list: {
                method:"GET",
                url:bzConfig.api()+'/cm/idea',
                isArray:false
            },
            send: {
                method:"POST",
                url:bzConfig.api()+'/cm/idea',
                isArray:false
            },
            remove: {
                method:"DELETE",
                url:bzConfig.api()+'/cm/idea',
                isArray:false
            }
        });

    }]);

});