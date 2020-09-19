<p align="center">
  <img width="100" height="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
</p>
<h2 align="center">Vue Extend Reactive</h2>
<p align="center">
  Vue helper to extend reactive object.
</p>

## Intro

This helper is compatible with both Vue 2 (using `@vue/composition-api`) and Vue 3
as it is just simple function to extend reactive object using proxy object.

A recommended use case is to extend reactive object returned from composition function
with additional reactive object(such as getters), or additional methods to get these benefits:

- Simplify returned object api of composition function.
- Eliminate overhead thinking of whether to use `value` property of `ref` object to get its value.

## Table of Contents
1. [Installation](#Installation)
2. [Usage](#Usage)
3. [API Reference](#API-Reference)
4. [Motivation](#Motivation)
5. [License](#License)

## Installation

- Using NPM
```bash
npm install vue-extend-reactive
```

- Using Yarn
```bash
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
      <button v-else-if="hotFood.isCool" @click="hotFood.heatup()">
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
    isHot: computed(() => state.temperatureInCelcius > coolTemperature),
    isCool: computed(() => state.isHot === false ),
  })

  function heatup() {
    state.temperatureInCelcius = temperatureInCelcius
    coolingIntervalId = setInterval(
      () => state.temperatureInCelcius -= 1,
      1000,
    )
  }

  function blow() {
    state.temperatureInCelcius -= 10
  }

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
    heatup()
  })

  return extend(state, {
    heatup,
    blow,
  })
}
</script>
```

## API Reference

```ts
export default extend

export declare function extend<O extends Dictionary, E extends Dictionary>(object: O, extension: E): O & E

interface Dictionary {
  [key: string]: any
}

```

## Motivation
Both reactive and ref have quirk in terms of their syntax. Let's use hot food example above to show it.

### Return reactive object returned as is
```js
import { reactive, computed } from 'vue'

const coolTemperature = 22

export function useHotFood({ temperatureInCelcius }) {  
  const state = reactive({
    temperatureInCelcius,
    isHot: computed(() => state.temperatureInCelcius > coolTemperature),
  })

  function blow() {
    state.temperatureInCelcius -= 10
  }

  // ...

  return {
    state,
    blow,
  }
}
```

State would lost reactivity if destructured, so it have to be returned as is.

```js
// Using reactive object named state
const hotFood = useHotFood({ temperatureInCelcius: 100 })
hotfood.state.temperatureInCelcius
hotfood.state.isHot
hotfood.blow()
```

### Return refs
```js
import { ref, computed } from 'vue'

const coolTemperature = 22

export function useHotFood(args) {  
  const temperatureInCelcius = ref(args.temperatureInCelcius)
  const isHot = computed(() => temperatureInCelcius.value > coolTemperature

  function blow() {
    temperatureInCelcius.value -= 10
  }

  // ...

  return {
    temperatureInCelcius,
    isHot,
    blow,
  }
}
```

Ref value have to be accessed through its value property. 
Ref may be unwrapped in template,
but it causes syntax inconsistency,
between template and script block.

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

### Enter vue-extend-reactive

To achieve terser syntax, reactive object needs to be extended,
maybe with another reactive object (like getters), or methods.

Reactive object can contain methods when using javascript,
but make it more verbose to call it in same block,
and create error when using typescript.

And thats why `vue-extend-reactive` is created,
to enable reactive object extension leveraging Proxy object,
especially in typescript.

```js
import { reactive, computed } from 'vue'
import { extend } from 'vue-extend-reactive'

const coolTemperature = 22

export function useHotFood({ temperatureInCelcius }) {  
  const state = reactive({
    temperatureInCelcius,
    isHot: computed(() => state.temperatureInCelcius > coolTemperature),
  })

  function blow() {
    state.temperatureInCelcius -= 10
  }

  // ...  

  return extend(state, { blow })
}
```

Below is the end result after returning extended reactive object.

```js
const hotFood = useHotFood({ temperatureInCelcius: 100 })
hotFood.temperatureInCelcius
hotFood.isHot
hotFood.blow()
```

There is one caveat that returned reactive object cannot be destructured as it will lost reactivity,
but that is a sacrifice I am willing to make, to get terser and more consistent syntax.

## License

[MIT](http://opensource.org/licenses/MIT)
