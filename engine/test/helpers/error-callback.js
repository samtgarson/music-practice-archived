import { Subject } from 'rxjs'
import errorCallback from '../../lib/helpers/error-callback'

describe('error callback', () => {
  let handler
  let bus
  const id = 1

  beforeEach(() => {
    bus = new Subject()
    handler = errorCallback(bus, id)
  })

  it('returns a function', () => {
    expect(handler).toBeInstanceOf(Function)
  })

  describe('with a callback', () => {
    let fn
    const payload = { a: 1 }
    const otherPayload = { b: 2 }

    beforeEach(() => {
      fn = jest.fn()

      handler(fn)
      expect(bus.observers.length).toBe(1)
    })

    afterEach(() => {
      bus.complete()
    })

    it('ignores messages from other namespace', () => {
      bus.next({ namespace: 'instruments' })
      bus.next({ namespace: 'testing' })

      expect(fn).not.toHaveBeenCalled()
    })

    it('ignores errors from other IDs', () => {
      bus.next({ namespace: 'error', payload, id: 2 })

      expect(fn).not.toHaveBeenCalled()
    })

    it('takes the first relevant error message', () => {
      bus.next({ namespace: 'error', payload: otherPayload, id: 2 })
      bus.next({ namespace: 'error', payload, id })
      bus.next({ namespace: 'error', payload: otherPayload, id })
      bus.next({ namespace: 'instruments' })

      expect(fn).toHaveBeenCalledWith(payload)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(bus.observers.length).toBe(0)
    })

    describe('when the error has already occurred', () => {
      beforeEach(() => {
        fn = jest.fn()
        handler = errorCallback(bus, id)
        bus.next({ namespace: 'error', payload, id })

        handler(fn)
      })

      it('calls the callback', () => {
        expect(fn).toHaveBeenCalledWith(payload)
      })
    })
  })
})
