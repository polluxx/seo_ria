define([
    'modules/aggregate/main/requests/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('RequestsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', '$location', 'ngTableParams', 'AggregateFactory', function($scope, $injector, bzUser, $routeParams, $location, ngTableParams, AggregateFactory) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});
        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,
            path: $location.path(),
            updated: this.updated || $routeParams.updated,
            lastChecked: null,
            shiftPressed: false,
            containsData: null,
            errors: [],
            searcheble: false,
            concurrents: true,
            params: {
                target: this.target,
                page: 1,            // show first page
                count: 100,          // count per page
                sorting: {
                    queriesCount: 'desc'     // initial sorting
                },
                newCheck: this.update
            },
            tableParams: new ngTableParams(this.params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    //$scope.tableParams.$loading = true;
                    // ajax request to api
                    AggregateFactory.requests(params.url(), function(data) {
                            //$scope.tableParams.$loading = false;


                            if(!data.data) {
                                $scope.containsData = null;
                                $defer.resolve(data.data);
                                $scope.errors = [data.error];

                                return;
                            }

                            if(data.data.items === undefined) {

                                $scope.containsData = null;
                                //$defer.resolve($scope.list = []);
                                return;
                            }
                            console.log(data);
                            params.total(data.data.total);
                            // set new data
                            $scope.containsData = (data.data.items !== undefined && data.data.items.length) ? true : false;
                            $defer.resolve($scope.list = data.data.items);
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
            start: function(update) {
                this.errors = [];

                this.containsData = null;
                this.searcheble = true;
                this.params.target = this.target;

                if(update != undefined) {
                    this.params.newCheck = this.update = update;
                    alertify.log("Запрос поставлен в очередь на проверку.");
                }

                $location.search(this.params);
                console.log(this.params);
                this.tableParams.parameters(this.params);
            },
            processed: function() {

                var params = {},
                    query = "MATCH (n:Link)-[:CONTAINS]->()-[:TOP10]-(concurrent)-[:CONTAINS]-() WHERE n.src = '"+$scope.target+"' OPTIONAL MATCH (n:Link)-[:CONTAINS]->()-[:TOP10]-(con) WHERE n.src = '"+$scope.target+"' RETURN  count(distinct concurrent) as c , count(distinct con) as t";
                params.query = query;
                AggregateFactory.query(params, function(resp) {
                    if(resp.errors && resp.errors.length) {
                        alertify.error("Ошибка получения счетчика обработаных");
                        console.error(resp.errors);
                        return;
                    }

                    var data = resp.results[0].data[0].row;
                    $scope.doneCount = data[0];
                    $scope.allCount = data[1];

                    $scope.percentile = Math.ceil(($scope.doneCount/$scope.allCount)*100);
                });
            }()
        });


        // init search
        if($scope.target) $scope.start();
    }]);


});
