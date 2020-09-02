export default extend;
export function extend(base, extension) {
    return new Proxy(base, {
        get(target, prop, receiver) {
            if (prop in extension) {
                return extension[prop];
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}
