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
            },
            count: {
                method:"GET",
                url: 'http://localhost:3000/api/count'
            },
            query: {
                method:"PUT",
                url: 'http://localhost:3000/api/query'
            },
            concurrents: {
                method:"GET",
                params: {
                    target: "@target",
                    keywords: "@keywords"
                },
                url: 'http://localhost:3000/api/concurrents'
            }
        });
    }]);
});