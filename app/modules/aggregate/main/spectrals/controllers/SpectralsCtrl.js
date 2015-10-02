define([
    'modules/aggregate/main/spectrals/module'
], function (module) {
    'use strict';

    module.controller('SpectralsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', '$location', 'AggregateFactory', 'ngTableParams', function($scope, $injector, bzUser, $routeParams, $location, AggregateFactory, ngTableParams) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});

        function getKeywords(keywords) {
            if(keywords === undefined) return undefined;

            if(typeof keywords === "string") return keywords;

            var keyword, result = {};
            for(keyword in keywords) {

                if(!keywords.hasOwnProperty(keyword)) continue;

                result[keyword] = keywords[keyword];
            }
            return result;
        }

        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,
            updated: this.updated || $routeParams.updated,
            keywords: $routeParams['keywords[]'],
            path: $location.path(),
            percentile: 0,
            marked: [],
            selected: { 'checked': false, items: {} },
            list: [],
            params: {
                page: 1,            // show first page
                count: 100,
                target: this.target,
                newCheck: this.updated,
                keywords: getKeywords(this.keywords)
            },
            lastPage: true,
            tableParams: new ngTableParams(this.params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    //$scope.tableParams.$loading = true;
                    // ajax request to api
                    AggregateFactory.synonims(params.url(), function(data) {
                            //$scope.tableParams.$loading = false;

                            if(!data.data) {
                                $scope.containsData = null;
                                $defer.resolve(data.data);
                                $scope.errors = [data.error];
                                return;
                            }

                            if(!data.data.data) {
                                $scope.containsData = null;
                                $defer.resolve(data.data.data);
                                $scope.errors = ['данных не найдено'];
                                return;
                            }

                            params.total(data.data.total);


                            // set new data
                            $scope.containsData = (data.data.data !== undefined && data.data.data.length) ? true : false;
                            $defer.resolve($scope.list = data.data.data);
                        },
                        function(err) {
                            if(err.status !== 200) {
                                $scope.errors = [err.data.error] || ["Проблема с апи, проверьте позже"];
                                $scope.containsData = null;
                                $defer.resolve($scope.list = []);
                            }
                            console.log(err);
                        });
                }
            })
        });

        // METHODS
        angular.extend($scope, {
            start: function() {
                $scope.params.target = $routeParams.target;
                if($scope.keywords !== undefined) $scope.params.keywords = getKeywords($scope.keywords);
                $scope.params.newCheck = $scope.updated;
                $location.search($scope.params);
                console.log($scope.params);


                $scope.tableParams.parameters($scope.params);

            }(),
            processed: function() {
                var params = {}, link = $scope.target,
                    query =
                        "MATCH (n:Link {src: '"+link+"'})-[*1..3]-(keyword:Keyword) \
                        RETURN count(distinct keyword.src) as co \
                        union \
                        MATCH (n:Link  {src: '"+link+"'})-[*1..3]-(keyword:Keyword)-[:COMES]-() \
                        RETURN count(distinct keyword.src) as co";
                    //query = "MATCH (n:Link  {src: '"+link+"'})-[*1..3]-(keyword:Keyword)-[:COMES]-() OPTIONAL MATCH (n:Link  {src: '"+link+"'})-[*1..3]-(k:Keyword) RETURN COUNT(DISTINCT keyword.src) as c, COUNT(DISTINCT k.src) as t";
                params.query = query;
                AggregateFactory.query(params, function(resp) {
                    if(resp.errors && resp.errors.length) {
                        alertify.error("Ошибка получения счетчика обработаных");
                        console.error(resp.errors);
                        return;
                    }
                    var data = resp.results[0].data;
                    $scope.doneCount = data[1].row[0];
                    $scope.allCount = data[0].row[0];


                    $scope.percentile = Math.ceil(($scope.doneCount/$scope.allCount)*100);
                });
            }()
        });
    }]);


});
