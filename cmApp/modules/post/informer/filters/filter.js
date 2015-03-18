define([
    'modules/post/informer/module'
], function (module) {
    'use strict';

    module.filter('sectohour', function () {
        return function (value) {
            var hours = "00";
            var mins = "00";

            if (value / 3600 >= 1) {
                hours = parseInt(value / 3600);
                value = value % 3600;
                hours = checkString(hours);
            }

            if (value / 60 >= 1) {
                mins = parseInt(value / 60);
                value = value % 60;
                mins = checkString(mins);
            }

            if (parseInt(mins) >= 60) {
                mins = "00";
                hours = parseInt(hours) + 1;
                hours = checkString(hours);
            }

            value = parseInt(value).toString();
            if (parseInt(value) >= 60) {
                value = "00";
                mins = parseInt(mins) + 1;
                mins = checkString(mins);
            }

            value = checkString(value);

            function checkString(str) {
                str = str.toString();
                if (str.length < 2) {
                    str = "0" + str;
                }
                return str;
            }

            return hours + ":" + mins + ":" + value;
        };
    });

    module.filter('idToProject', function () {

        return function (value) {
            var code = "ria";
            value = +value;
            switch (value) {
                case 1:
                    code = "auto";
                    break;
                case 3:
                    code = "dom";
                    break;
                case 5:
                    code = "market";
                    break;
            }

            return code;
        }
    });

    module.filter('ordering', function () {
        return function (data, cell, reverse) {
            var filtered = [];
            angular.forEach(data, function (item) {
                filtered.push(item);
            });

            filtered.sort(function (a, b) {
                return (a[cell] > b[cell]);
            });

            if (reverse) filtered.reverse();

            return filtered;
        }
    });

    module.filter('groupFilter', function () {
        return function (data, groupby) {
            var filtered = [];
            var flag;
            if (data) {
                angular.forEach(data, function (item) {
                    flag = true;
                    angular.forEach(filtered, function (itemSec) {
                        if (flag == true && item[groupby] == itemSec[groupby]) {
                            flag = false;
                        }
                    });
                    if (flag == true) filtered.push(item);
                });
            }

            return filtered;

        }
    });

    module.filter('image', function () {
        return function (result, project) {
            var link;

            switch (result.projectId) {
                case 1:
                    link = result.image || result.photo;
                    link = link.replace(/\?.\d+/, "");
                    return "http://cdn.riastatic.com/photos/" + link.slice(0, -4) + "m.jpg";
                    break;
                case 2:
                    link = result.main_photo_url;
                    link = link.replace(/\?.\d+/, "");
                    return "http://cdn.riastatic.com/photos/" + link.slice(0, -4) + "m.jpg";
                    break;
                case 3:
                    link = result.main_photo;
                    if (link) {
                        link = link.replace(/\?.\d+/, "");
                        link = link.replace(/\?.\d+/, "");
                    }
                    return "http://cdn.riastatic.com/photos/" + link.slice(0, -4) + "b.jpg";
                    break;
                case 5:
                    link = result.photo;
                    return link;
                    break;
                case 6:

                    return result.img;
                    break;
            }
        }
    });

    module.filter('link', function () {
        return function (data, project) {
            switch (data.projectId) {
                case 1:
                    if (data.model_link == undefined) {
                        return "http://auto.ria.com" + data.link;
                    }
                    return "http://auto.ria.com/auto_" + data.link + "-" + data.model_link + "_" + data.auto_id + ".html";
                    break;
                case 2:
                    return "http://ria.com/" + data.name_translit + "-" + data._id + ".html";
                    break;
                case 3:
                    return "http://dom.ria.com/ru/realty-" + data.adv_id + ".html";
                    break;
                case 5:
                    return data.href;
                    break;
                case 6:
                    return data.site;
                    break;
            }

        }
    });


    module.filter('price', function () {
        return function (result, project) {
            switch (result.projectId) {
                case 1:
                    price = result.price_dollar || result.price_usd;
                    price += " $";
                    if (result.price_dollar == 0) price = "";

                    break;
                case 2:
                    price = result.price + " " + result.currency_name;
                    if (result.price == 0) price = "";

                    break;
                case 3:
                    price = result.price_all + " " + result.currency_type;
                    if (!result.price_all) price = "";

                    break;
                case 5:
                    price = result.price + " грн.";
                    break;
                case 6:
                    var price = (result.price != undefined && result.price.length > 0) ? result.price : "";
                    if (price.match(/[\d+]/g)) {
                        price += " грн.";
                    }

                    break;
            }

            return formatNumber(price);
        }
    });

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
    }

    module.filter('title', function () {
        return function (result, project) {
            switch (result.projectId) {
                case 1:
                    return result.marka;
                    break;
                case 2:
                    var name = result.name;
                    return name;
                    //return name.substr(0, 25)+"...";
                    break;
                case 3:
                    return result.simple_char_arr;
                    break;
                case 5:
                    return result.name.substr(0, 18) + "...";
                    ;
                    break;
                case 6:
                    var name = result.name;
                    return name.substr(0, 21) + "...";
                    break;
            }
        }
    });

    module.filter('news', function () {
        return function (title) {
            return title.substr(0, 40) + "...";
        }
    });

    module.filter('city', function () {
        return function (result, project) {

            switch (result.projectId) {
                case 1:

                    return result.salon != undefined ? result.salon.city : result.cityName;
                    break;
                case 2:
                    return result.city_name ? result.city_name : "Украина";
                    break;
                case 3:
                    return result.city;
                    break;
                case 5:
                    return result.category;
                    break;
                case 6:
                    var name = result.address;
                    return name.substr(0, 22) + "...";
                    break;
            }
        }
    });

    module.filter('userPhone', function () {
        return function (result, item) {
            if (item.salon != undefined) return result;

            return result.slice(0, -3) + "...";
        }
    });

    module.filter('projectName', function () {
        return function (projectId) {
            var projectsNames = [];
            projectsNames[1] = "auto.RIA.com",
                projectsNames[2] = "RIA.com",
                projectsNames[3] = "dom.RIA.com",
                projectsNames[4] = "Смешанный",
                projectsNames[5] = "market.RIA.com",
                projectsNames[6] = "Новостройки на dom.RIA.com";

            return (projectsNames[projectId] != undefined) ? projectsNames[projectId] : projectId;
        }
    })

    module.filter('pattern', function () {
        return function (source, pattern) {
            var reg = new RegExp(pattern);
            return reg.test(source)
        }
    })

});