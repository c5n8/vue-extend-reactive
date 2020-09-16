export default extend

export function extend<O extends Dictionary, E extends Dictionary>(
  object: O,
  extension: E
) {
  return <O & E>new Proxy(object, {
    get(target, prop, receiver) {
      if (prop in extension) {
        return extension[<string>prop]
      }

      return Reflect.get(target, prop, receiver)
    },
  })
}

interface Dictionary {
  [key: string]: any
}
