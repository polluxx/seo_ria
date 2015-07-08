define([
    'base/module'
], function (module) {
    'use strict';

    module.config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider
            .setPrefix('cmApp')
    }]);

    return module;

});