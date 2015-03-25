if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
if(!Array.prototype.findElm) {
    Array.prototype.findElm = function (predicate, needle) {
        if (this == null) {
            throw new TypeError('predicate on null');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        if (typeof needle !== 'object') {
            throw new TypeError('needle must be an object');
        }

        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, needle)) {
                return i;
            }
        }
        return -1;
    }
}