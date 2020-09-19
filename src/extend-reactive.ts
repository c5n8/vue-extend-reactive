export default extend

export function extend<O extends Dictionary, E extends Dictionary>(
  object: O,
  extension: E
) {
  return <O & E>new Proxy(object, {
    get(...args) {
      const [, prop] = args

      if (prop in extension) {
        return extension[<string>prop]
      }

      return Reflect.get(...args)
    },

    set(...args) {
      const [, prop, value] = args
      if (prop in extension) {
        ;(<Dictionary>extension)[<string>prop] = value

        return true
      }

      Reflect.set(...args)

      return true
    },
  })
}

interface Dictionary {
  [key: string]: any
}
