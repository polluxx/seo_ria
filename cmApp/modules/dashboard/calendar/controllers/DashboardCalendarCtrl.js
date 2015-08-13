define([
    'modules/dashboard/calendar/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('DashboardCalendarCtrl', ['$scope', 'bzUser', 'DashboardFactory', '$rootScope', 'PostFactory', function($scope, bzUser, DashboardFactory, $rootScope, PostFactory) {
        $scope.$loading = true;
        $scope.posts = [];

        var currentDate = new Date();
        var timeOut, timeIn, timeFor, month, day;
        $scope.settedDate = currentDate;
        $scope.currentDay = currentDate;
        $scope.daysList = [];


        // MAKE REQUEST
        $scope.makeReq = function(isTimeout) {
            $scope.$loading = true;
            var fromDate = new Date($scope.settedDate);
            var toDate = new Date($scope.settedDate);
            fromDate.setDate(1);
            toDate.setMonth(toDate.getMonth()+1);
            toDate.setDate(0);

            var paramsToSet = {
                'project': $rootScope.currentProject.id,
                'range': {
                    'publication_date': {
                        'from': returnFormattedDate(fromDate),
                        'to': returnFormattedDate(toDate)
                    }
                },
                'limit' : 200
            };


            DashboardFactory.list(paramsToSet, function(resp) {
                $scope.$loading = false;
                if(resp.code != 200) {
                    alertify.error("Не найдено данных. Пожалуйста, попробуйте позже");
                    return;
                }

                $scope.posts = resp.items.data;

                if($scope.posts) {
                    var posts = [], postItem, postTime;
                    for(var post in $scope.posts) {
                        postItem = $scope.posts[post];
                        if(postItem.publication == undefined) continue;

                        postTime = postItem.publication.date;

                        if(posts[postTime] == undefined) {
                            posts[postTime] = [];
                        }
                        posts[postTime].push(postItem);
                    }

                    var items = $scope.daysList, currentTime = returnFormattedDate(new Date());

                    items.forEach(function(item) {
                        if(item.time == 'nulled') return;

                        timeFor = returnFormattedDate(new Date(item.time));
                        if(timeFor===currentTime) item.today = true;

                        item.value = posts[timeFor] != undefined ? posts[timeFor] : [];
                    });
                }

                $scope.updatePost = function(post) {
                    $scope.$loading = true;

                    PostFactory.send(post, function(resp) {
                        if(resp.code != 200) {
                            alertify.error(resp.message);
                            $scope.$loading = false;
                            return;
                        }
                        //$scope.daysList = [];
                        $scope.daysList = [];

                        $scope.dateSet($scope.settedDate, true);
                    });
                }

            });
        };
        // END


        var makeItem = function(result, times) {

            if(result != 'nulled') {
                result = new Date(result);
            }
            var results = $scope.daysList;
            for(var i=0; i<times; i++) {
                var item = {};
                item = {time:result, value:[]};
                results.push(item);
            }

            $scope.daysList = results;
        };

        var findDaysSlice = function(date, isRevert) {
            var fromday = date.getDay();

            if(isRevert == undefined) {
                if(fromday == 0) {
                    fromday = 6;
                } else {
                    fromday--;
                }
            } else {
                var numvars = 6;
                if(fromday) {
                    numvars = 7;
                }
                fromday = numvars - fromday;
            }
            return fromday;
        };

        var returnFormattedDate = $scope.returnFormattedDate = function(time) {
            timeOut = new Date(time);

            month = ''+(timeOut.getMonth()+1);
            day = ''+timeOut.getDate();
            if(month.length < 2) month = "0"+month;
            if(day.length < 2) day = "0"+day;

            return timeOut.getFullYear()+"-"+month+"-"+day;
        };

        //$scope.currentDate.setMonth(from.getMonth()+1);
        $scope.dateSet = function(dateOld, isTimeout) {
            var date = new Date(dateOld.getTime());

            date.setDate(1);

            var fromday = findDaysSlice(date);
            makeItem("nulled", fromday);

            date.setMonth(date.getMonth()+1);
            date.setDate(0);
            var today = findDaysSlice(date, true);

            var days = +date.getDate(), day;

            date.setDate(1);
            for(var i=1;i<days+1; i++) {
                date.setDate(i);
                makeItem(date, 1);
            }
            makeItem("nulled", today);

            $scope.makeReq(isTimeout);
            //console.log($scope.daysList);
        };
        $scope.dateSet($scope.settedDate, true);

        // date add - sub
        $scope.calcDate = function(oper) {
            $scope.daysList = [];
            var currMonth;
            if(oper == "add") {
                currMonth = $scope.settedDate.getMonth()-1;
            } else {
                currMonth = $scope.settedDate.getMonth()+1;
            }

            $scope.settedDate.setMonth(currMonth);
            $scope.dateSet($scope.settedDate);
        };
        $scope.returnCurrent = function(current) {
            $scope.daysList = [];
            var currdate = new Date();
            $scope.settedDate.setMonth(currdate.getMonth());
            $scope.settedDate.setFullYear(currdate.getFullYear());
            $scope.dateSet($scope.settedDate);
        };

        $scope.isRow = function(index) {
            var result = (index+1) % 7;
            if(!result) return true;

            return false;
        }

        $scope.listSlice = function(index) {

            index += 1;
            var slice = $scope.daysList.slice(index-7,index);
            return slice;
        }

        var days = {1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat",0:"Sun"};
        $scope.returnWeekDay = function(index) {
            var result = (index+1) % 7;
            return days[result];
        }

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject == undefined) return;

            $scope.makeReq();
        });


    }]);

});