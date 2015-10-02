
define(['base/home/module'], function (module) {
    module.filter('trimmer', function() {
            return function (item, expression, end) {
                if (expression === undefined) {
                    expression = /(^\/|\/$)/g;
                }
                if (end === undefined) {
                    end = "";
                }

                return item.trim().replace(expression, end);
            }
        }
    );

    module.filter('nLevel', function() {
        return function(item, secondary) {
            switch(item) {
                case 1:
                    return 'warning';
                    break;
                case 2:
                case 3:
                case 4:
                    if(secondary !== undefined) return 'bolt';
                    return 'danger';
                    break;
                case 5:
                    if(secondary !== undefined) return 'plus';
                    return 'success';
                    break;
            }
        }
    });

    module.filter('decode', function() {
        return function(item){
            return decodeURI(item);
        }
    });

    module.filter('dateTime', function() {
        return function(data, format) {
            var date = new Date(data);

            return date.toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        }
    });
});