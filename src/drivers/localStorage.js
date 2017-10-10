import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
import { curry, cond, propEq } from 'ramda'

const setItem = (action) => {
  localStorage.setItem(action.key, action.value);
}

const fetchItem = (sendFn, action) => {
  const value = localStorage.getItem(action.key)
  sendFn(value);
}

export default function makeLocalStorageDriver() {
  return (localStoreAction$) => {

    const fetchLocalStoreProxy$ = xs.create();

    const sendItemToProxy = curry(fetchItem)(value => fetchLocalStoreProxy$.shamefullySendNext(value))

    const fetchSendItem = cond([
      [propEq('type', 'get'), sendItemToProxy],
      [propEq('type', 'set'), setItem]
    ])

    localStoreAction$.addListener({
      next: fetchSendItem,
      error: () => {},
      complete: () => { console.log('Completed') }
    })

    return adapt(fetchLocalStoreProxy$);
  }
}
