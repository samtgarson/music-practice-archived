import { first } from 'rxjs/operators'
import { AsyncSubject } from 'rxjs'

export default (bus, id) => {
  const asyncSubject = new AsyncSubject()
  bus
    .pipe(first(e => e.namespace === 'error' && e.id === id))
    .subscribe(asyncSubject)

  return fn => {
    asyncSubject.subscribe(({ payload }) => fn(payload))
  }
}
