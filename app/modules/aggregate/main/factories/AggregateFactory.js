define([
    'modules/aggregate/main/module'
], function (module) {
    'use strict';

    module.factory("AggregateFactory", ["$resource", "bzConfig", function($resource, bzConfig) {

        return $resource("http://localhost:10101/act", {}, {
            top: {
                method:"GET",
                params: {
                    target: "@target"
                },
                url: 'http://localhost:3000/api/top100'
            }
        });
    }]);
});