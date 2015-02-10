define([
    'modules/list/history/module'
], function (module) {
    'use strict';

    module.factory("HistoryFactory", ["$resource", "bzConfig", function($resource, bzConfig) {

        return $resource("history/", {}, {
            get: {
                method:"GET",
                url:bzConfig.api()+'/seo/history',
                isArray:false
            }
        });
    }]);
});