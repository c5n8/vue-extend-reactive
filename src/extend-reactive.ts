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

    set(target, prop, value) {
      if (prop in extension) {
        ;(<{ [key: string]: any }>extension)[<string>prop] = value

        return true
      }

      ;(<{ [key: string]: any }>target)[<string>prop] = value

      return true
    },
  })
}

interface Dictionary {
  [key: string]: any
}
