define([
    'modules/aggregate/main/topkeys/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('TopKeysCtrl', ['$scope', '$rootScope', 'bzUser', '$routeParams', '$location', 'AggregateFactory', 'ngTableParams', function($scope, $rootScope, bzUser, $routeParams, $location, AggregateFactory, ngTableParams) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});

        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,
            selected: { 'checked': false, items: {} },
            searcheble: false,
            containsData: null,
            domain: $rootScope.domain,
            path: $location.path(),
            update: undefined,
            marked: [],
            lastChecked: null,
            shiftPressed: false,
            params: {
                target: this.target,
                page: 1,            // show first page
                count: 100,          // count per page
                sorting: {
                    position: 'asc'     // initial sorting
                },
                newCheck: this.update
            },
            tableParams: new ngTableParams(this.params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    //$scope.tableParams.$loading = true;
                    // ajax request to api
                    AggregateFactory.top(params.url(), function(data) {
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
            validate: function(){
                if(this.target === undefined || this.target.length < 2) {
                    alertify.error("Количество символов ссылки меньше 2");
                    return null;
                }

                this.target = this.target.trim().replace(/(^\/|\/$)/g, "");
                /*if(this.target.match(/(http|https|www|\s)/g)) {
                    alertify.error("Недопустимые символы в ссылке");
                    return null;
                }*/

                return true;
            },
            start: function(update) {
                this.errors = [];

                this.containsData = null;
                this.searcheble = true;
                if(!this.validate()) return;
                var self = this;

                if(update != undefined) {
                    this.params.newCheck = this.update = update;
                    alertify.log("Запрос поставлен в очередь на проверку.");
                }
                //this.params.target = this.domain + "/" + this.target;
                this.params.target = this.target;

                $location.search(this.params);
                console.log(this.params);
                this.tableParams.parameters(this.params);
                //this.tableParams.reload();

            },
            next: function(target, isUrl) {
                var params = {
                    newCheck: true
                };
                if(isUrl) {
                    params.target = target;
                } else {
                    params.keywords = target;
                }
                AggregateFactory.concurrents(params, function(resp) {
                    console.log(resp);
                });

                alertify.log("Запрос успешно поставлен в очередь");
                $location.url('/aggregate/concurrents?updated=true&target='+$routeParams.target);
            },
            checkboxes: function(){
                var self = this;

                $scope.$watch("selected.checked", function(value) {
                    angular.forEach($scope.list, function(item) {
                        if (angular.isDefined(item.src)) {
                            $scope.selected.items[item.src] = value;
                            $scope.checkBox(item, value);
                        }
                    });
                });
            }(),
            checkBox: function(item, type, bulk) {

                var index = $scope.marked.indexOf(item.src);

                // check shift
                if($scope.shiftPressed && bulk === undefined) {
                    this.setBulk($scope.lastChecked, item);
                    return;
                }

                if(item.position !== undefined) $scope.lastChecked = item;

                if(~index && !type) $scope.marked.splice(index, 1);
                if(!~index && type) $scope.marked.push(item.src);
                //$scope.$apply();
            },
            setBulk: function(from, to) {
                if(from === null) return;

                var start = null, end = null, value, src;
                angular.forEach($scope.list, function(item) {
                    src = item.src;
                    if(end !== null) return;
                    if(src === from.src) {
                        if(start === null) {
                            start = from.src;
                        } else {
                            if(end === null) end = from.src;
                        }
                    }
                    if(src === to.src) {
                        if(start === null) {
                            start = to.src;
                        } else {
                            if(end === null) end = to.src;
                        }
                    }
                    if(start !== null) {
                        if(src === start) {
                            value = $scope.selected.items[src];
                        }
                        $scope.selected.items[src] = value;
                        $scope.checkBox(item, value, true);
                    }

                });
            },
            remove: function(keyword) {
                if(keyword === undefined || !keyword instanceof Array) return;
                var params = {}, map = [], index, item;
                alertify.confirm("Вы уверены?", function(e) {
                    if(!e) return;

                    map = keyword;
                    keyword = keyword.map(function(item) {
                        return "'"+item+"'";
                    });
                    params.query = "MATCH (a:Link),(k:Keyword) OPTIONAL MATCH (a)-[rel]-(k) WHERE k.src IN ["+keyword.join(",")+"] DELETE rel";

                    AggregateFactory.query(params, function(response) {
                            if(response.results === undefined || !response.results.length) {
                                alertify.error("Ошибка удаления. Поробуйте позже");
                                return;
                            }

                            console.log(map);
                            for(index in map) {
                                if(!map.hasOwnProperty(index)) continue;

                                $scope.marked.splice($scope.marked.indexOf(map[index]));
                            }
                            $scope.tableParams.reload();

                        },
                        function(err) {
                            if(err.status !== 200) {
                                alertify.error(err.data.error);
                            }
                        });
                });

            }
        });

        document.addEventListener('keydown', function(e) {
            if(e.shiftKey) $scope.shiftPressed = true;
        });
        document.addEventListener('keyup', function(e) {
            if(e.keyCode === 16) $scope.shiftPressed = false;
        });

        // init search
        if($scope.target) $scope.start();
    }]);


});
