export default extend;
export function extend(object, extension) {
    return new Proxy(object, {
        get(target, prop, receiver) {
            if (prop in extension) {
                return extension[prop];
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}
