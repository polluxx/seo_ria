define([
    'modules/parser/rank/module',

    'modules/parser/rank/controllers/ParserRankCtrl'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/rank', 'rank')
                .segment('rank', {
                    templateUrl: bzConfigProvider.templateUrl('/parser/rank.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'ParserRankCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});