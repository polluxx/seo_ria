define([
    'base/config/module',

], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', '$locationProvider', 'bzConfigProvider', 'bzLanguageProvider', '$routeProvider',
        function ($routeSegmentProvider, $locationProvider, bzConfigProvider, bzLanguageProvider, $routeProvider) {
            $locationProvider
                .html5Mode(true)
                .hashPrefix('!');

            $routeSegmentProvider.options.autoLoadTemplates = true;
            // $logProvider.debugEnabled(false);

            bzConfigProvider.templatePrefix('/views/cm');

            bzLanguageProvider.id((window.bazalt || {}).language || null);

            // fix for drag and drop
            $.event.props.push('dataTransfer');

            $routeProvider.otherwise({
                redirectTo: '/dashboard'
            });
        }]);

    return module;

});