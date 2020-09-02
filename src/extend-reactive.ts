interface Dictionary {
  [key: string]: any
}

export default extend

export function extend<B extends Dictionary, E extends Dictionary>(
  base: B,
  extension: E
): B & E {
  return <B & E>new Proxy(base, {
    get(target, prop, receiver) {
      if (prop in extension) {
        return extension[<string>prop]
      }

      return Reflect.get(target, prop, receiver)
    },
  })
}
