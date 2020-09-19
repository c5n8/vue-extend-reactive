export default extend;
export function extend(object, extension) {
    return new Proxy(object, {
        get(...args) {
            const [, prop] = args;
            if (prop in extension) {
                return extension[prop];
            }
            return Reflect.get(...args);
        },
        set(...args) {
            const [, prop, value] = args;
            if (prop in extension) {
                ;
                extension[prop] = value;
                return true;
            }
            Reflect.set(...args);
            return true;
        },
    });
}
