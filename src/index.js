import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'
import makeLocalStorageDriver from './drivers/localStorage'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app'),
  storage: makeLocalStorageDriver()
}

run(main, drivers)
