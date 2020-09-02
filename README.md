<p align="center">
  <img width="100" height="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
</p>
<h2 align="center">Vue Extend Reactive</h2>
<p align="center">
  Vue helper to extend reactive object.
</p>

# Notice

This helper is compatible with both Vue 2 (using `@vue/composition-api`) and Vue 3
as it is just simple function to extend reactive object using proxy object.

A recommended use case is to extend reactive object returned from composition function
with additional reactive object(such as getters), or additional methods.

# Motivation
Both reactive and ref have quirk in terms of their syntax.

Using hot food example below showing their syntax.

- State would lost reactivity if destructured, so it have to be returned as is.

```js
// Using reactive object named state
const hotFood = useHotFood({ temperatureInCelcius: 100 })
hotfood.state.temperatureInCelcius
hotfood.state.isHot
hotfood.blow()
```


- Ref value have to be accessed through its value property. 
Ref may be unwrapped in template,
but it causes syntax inconsistency,
between template and script.

```js
// Using ref for each prop of state
const hotFood = useHotFood({ temperatureInCelcius: 100 })
hotFood.temperatureInCelcius.value
hotFood.isHot.value
hotFood.blow()
// or
const { temperatureInCelcius, isHot, blow } = useHotFood({ temperatureInCelcius: 100 })
temperatureInCelcius.value
isHot.value
blow()
```

To achieve terser syntax, reactive object needs to be extended,
maybe with another reactive object (like getters), or methods.

Reactive object can contain methods when using javascript,
but make it more verbose to call it in same block,
and create error when using typescript.

And thats why `vue-extend-reactive` is created,
to enable reactive object extension through Proxy object,
especially in typescript.

Below is the end result after returning extended reactive object.


```js
const hotFood = useHotFood({ temperatureInCelcius: 100 })
hotFood.temperatureInCelcius
hotFood.isHot
hotFood.blow()
```

Returned reactive object cannot be destructured as it will lost reactivity,
but that is a sacrifice I am willing to make, to get terser and more consistent syntax.

## Installation

- Using NPM
```
npm install vue-extend-reactive
```

- Using Yarn
```
yarn add vue-extend-reactive
```

## Usage

```html
<template>
  <main>
    <div>
      Hot Food!
    </div>
    <div>
      Temperature: {{ hotFood.temperatureInCelcius }} C
    </div>
    <div>
      Is it cool?: {{ hotFood.isCool ? 'Just cool. Into the mouth!' : 'Nope' }}
    </div>
    <div>
      <button v-if="hotFood.isHot" @click="hotFood.blow()">
        Blow
      </button>
      <button v-else-if="hotFood.isCool" @click="hotFood.start()">
        Again
      </button>
    </div>
  </main>
</template>

<script>
// using Vue 2 with composition-api plugin
// import { reactive } from '@vue/composition-api'
// or Vue 3
import { reactive, computed, onMounted, watch } from 'vue'
import { extend } from 'vue-extend-reactive'

export default {
  setup() {
    const hotFood = useHotFood({ temperatureInCelcius: 100 })

    return {
      hotFood,
    }
  }
}

const coolTemperature = 22

export function useHotFood({ temperatureInCelcius }) {  
  const state = reactive({
    temperatureInCelcius,
    isHot: computed(() => state.temperatureInCelcius > coolTemperature ),
    isCool: computed(() => state.isHot === false ),
  })

  let coolingIntervalId

  watch(
    () => state.temperatureInCelcius,
    (temperatureInCelcius) => {
      if (temperatureInCelcius <= coolTemperature) {
        clearInterval(coolingIntervalId)
      }
    }
  )

  onMounted(() => {
    start()
  })

  function start() {
    state.temperatureInCelcius = temperatureInCelcius
    coolingIntervalId = setInterval(
      () => state.temperatureInCelcius -= 1,
      1000,
    )
  }

  function blow() {
    state.temperatureInCelcius -= 10
  }

  return extend(state, {
    start,
    blow,
  })
}
</script>
```

## API Reference

```ts
export default extend

export declare function extend<B extends Dictionary, E extends Dictionary>(base: B, extension: E): B & E

interface Dictionary {
  [key: string]: any
}

```

## License

[MIT](http://opensource.org/licenses/MIT)
