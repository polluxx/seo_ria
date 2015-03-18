define([
    'base/home/module'
], function (module) {
    'use strict';

    module.filter('linkdefault', function () {
        return function (value) {
            if(value == undefined) return "javascript:void(0)";

            return value;
        };
    });

});