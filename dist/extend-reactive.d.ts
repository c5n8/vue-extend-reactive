interface Dictionary {
    [key: string]: any;
}
export default extend;
export declare function extend<B extends Dictionary, E extends Dictionary>(base: B, extension: E): B & E;
