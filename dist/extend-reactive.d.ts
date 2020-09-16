export default extend;
export declare function extend<O extends Dictionary, E extends Dictionary>(object: O, extension: E): O & E;
interface Dictionary {
    [key: string]: any;
}
