import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
import { curry, cond, propEq } from 'ramda'

const setItem = curry((storage, action) => {
  storage.setItem(action.key, action.value);
});

const fetchItem = curry((sendFn, storage, action) => {
  const value = storage.getItem(action.key)
  sendFn(value);
});

const fetchSendItem = (getItemFn, setItemFn) => (action) => cond([
  [propEq('type', 'get'), getItemFn],
  [propEq('type', 'set'), setItemFn]
])

export default function makeLocalStorageDriver() {
  return (localStoreAction$) => {
    const fetchLocalStoreProxy$ = xs.create();

    const setItemToStorage = setItem(localStorage);
    const sendItemToProxy = fetchItem(value => fetchLocalStoreProxy$.shamefullySendNext(value), localStorage)

    localStoreAction$.addListener({
      next: fetchSendItem(setItemToStorage, sendItemToProxy),
      error: () => {},
      complete: () => { console.log('Completed') }
    })

    return adapt(fetchLocalStoreProxy$);
  }
}
