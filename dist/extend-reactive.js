"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
exports.default = extend;
function extend(object, extension) {
    return new Proxy(object, {
        get: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var prop = args[1];
            if (prop in extension) {
                return extension[prop];
            }
            return Reflect.get.apply(Reflect, args);
        },
        set: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var prop = args[1], value = args[2];
            if (prop in extension) {
                ;
                extension[prop] = value;
                return true;
            }
            Reflect.set.apply(Reflect, args);
            return true;
        },
    });
}
exports.extend = extend;
