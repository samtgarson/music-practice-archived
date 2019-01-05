import { Subject } from 'rxjs'
import factory from '../../lib/services/factory'

describe('service factory', () => {
  let bus
  let service

  const scope = 'scope'
  const payload = { a: 1 }
  const spy = jest.fn()
  const services = {
    test: function TestService () {
      this.call = spy
    }
  }

  beforeEach(() => {
    bus = new Subject()
    const Service = factory(scope, services)

    service = new Service(bus)
    expect(bus.observers.length).toEqual(1)
  })

  afterEach(() => {
    service.unsubscribe()
    expect(bus.observers.length).toEqual(0)
  })

  it('filters the events and triggers services', () => {
    bus.next({ key: 'test', namespace: 'scope', payload })
    bus.next({ key: 'test', namespace: 'something else', payload })
    bus.next({})

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(payload)
  })
})
