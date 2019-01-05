import { Subject } from 'rxjs'
import { filter, tap } from 'rxjs/operators'
import uuid from 'uuid/v4'
import services from './services'
import errorCallback from './helpers/error-callback'

export default function Engine ({ debug = false } = {}) {
  let bus = new Subject()
  if (debug) bus = bus.pipe(tap(e => console.log(e)))

  services.map(Service => new Service(bus))

  this.emit = (evt, payload, opts = {}) => {
    const [namespace, key] = evt.split(':')
    const id = uuid()
    const handler = errorCallback(bus, id)

    bus.next({
      id, namespace, key, payload, ...opts
    })

    return { catch: handler }
  }

  this.subscribe = (fn, { namespace: namespaceFilter } = {}) => {
    bus
      .pipe(filter(({ namespace, internal }) => {
        if (internal) return false
        if (!namespaceFilter) return true
        return namespace === namespaceFilter
      }))
      .subscribe(({ namespace, key, payload }) => fn(`${namespace}:${key}`, payload))
  }

  this.end = () => {
    bus.complete()
  }
}
