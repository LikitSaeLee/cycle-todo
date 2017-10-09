import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';

export default function makeLocalStorageDriver() {
  return (localStoreAction$) => {
    const fetchLocalStoreProxy$ = xs.create();

    localStoreAction$.addListener({
      next: ({type, key, value}) => {
        if (type === 'set') {
          localStorage.setItem(key, value);
          return
        }

        if (type === 'get') {
          const value = localStorage.getItem(key);
          fetchLocalStoreProxy$.shamefullySendNext(value);
          return
        }
      },
      error: () => {},
      complete: () => { console.log('Completed') }
    })

    return adapt(fetchLocalStoreProxy$);
  }
}
