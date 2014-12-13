define([
    'base/module'
], function (module) {
    'use strict';

    module.config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider
            .setPrefix('seoApp')
            .setStorageType('sessionStorage')
            .setNotify(true, true)
    }]);

    return module;

});