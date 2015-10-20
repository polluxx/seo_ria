define([
    'modules/aggregate/main/module'
], function (module) {
    'use strict';

    module.factory("AggregateFactory", ["$resource", "bzConfig", function($resource, bzConfig) {


        var api = "http://cm.ria.com:3138/api";
        //var api = "http://localhost:3000/api";
        return $resource("http://localhost:10101/act", {}, {
            top: {
                method:"GET",
                params: {
                    target: "@target"
                },
                url: api+'/check/top100'
            },
            count: {
                method:"GET",
                url: api+'/check/count'
            },
            yaxmlcount: {
                method:"GET",
                url: api+'/check/yaxmlcount'
            },
            query: {
                method:"PUT",
                url: api+'/check/query'
            },
            concurrents: {
                method:"GET",
                params: {
                    target: "@target",
                    keywords: "@keywords"
                },
                url: api+'/check/concurrents'
            },
            requests: {
                method:"GET",
                params: {
                    target: "@target"
                },
                url: api+'/check/concurrent-keys'
            },
            synonims: {
                method:"GET",
                params: {
                    target: "@target",
                    keywords: "@keywords"
                },
                url: api+'/check/syno'
            }
        });
    }]);
});