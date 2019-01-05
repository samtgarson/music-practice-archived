import { Subject as MockedSubject } from 'rxjs'
import { filter, tap } from 'rxjs/operators'
import Engine from '../lib'
import services from '../lib/services'
import errorCallback from '../lib/helpers/error-callback'

jest.mock('../lib/services', () => [jest.fn(), jest.fn()])
jest.mock('../lib/helpers/error-callback', () => {
  const handler = jest.fn()
  return jest.fn(() => handler)
})

jest.mock('rxjs', () => {
  const rxjs = jest.genMockFromModule('rxjs')
  function MockSubject () { }

  MockSubject.prototype.next = jest.fn()
  MockSubject.prototype.pipe = jest.fn()
  MockSubject.prototype.subscribe = jest.fn()
  MockSubject.prototype.complete = jest.fn()

  MockSubject.prototype.pipe.mockReturnThis()
  rxjs.Subject = MockSubject
  return rxjs
})

jest.mock('rxjs/operators')

describe('engine', () => {
  let engine

  beforeEach(() => {
    engine = new Engine()
  })

  afterEach(() => {
    engine.end()
  })

  it('instantiates services', () => {
    services.forEach(service => {
      expect(service).toHaveBeenCalledWith(expect.any(MockedSubject))
    })
  })

  it('does not debug by default', () => {
    expect(tap).not.toHaveBeenCalled()
  })

  it('debugs if option is provided', () => {
    engine = new Engine({ debug: true })
    expect(tap).toHaveBeenCalledWith(expect.any(Function))
  })

  describe('#emit', () => {
    let bus
    let result
    const key = 'namespace:key'
    const payload = 'payload'
    const options = { internal: true }

    beforeEach(() => {
      bus = new MockedSubject()
      result = engine.emit(key, payload, options)
    })

    it('puts a message on the bus', () => {
      expect(bus.next).toHaveBeenCalledWith({
        key: 'key',
        namespace: 'namespace',
        payload,
        id: expect.any(String),
        ...options
      })
    })

    it('returns a error handler', () => {
      expect(result.catch).toEqual(errorCallback())
    })
  })

  describe('#subscribe', () => {
    let bus
    let fn
    const namespace = 'namespace'
    const key = 'key'
    const payload = { a: 1 }
    const emit = args => bus.subscribe.mock.calls[0][0](args)

    beforeAll(() => {
      jest.unmock('rxjs')
    })

    beforeEach(() => {
      jest.clearAllMocks()
      bus = new MockedSubject()
      fn = jest.fn()
    })

    it('subscribes to the bus', () => {
      engine.subscribe(fn)

      expect(bus.pipe).toHaveBeenCalled()
      expect(bus.subscribe).toHaveBeenCalled()

      emit({ namespace, key, payload })

      expect(fn).toHaveBeenCalledWith(`${namespace}:${key}`, payload)
    })

    describe('filter', () => {
      let filterFn

      describe('with no filter', () => {
        beforeEach(() => {
          engine.subscribe(fn);

          [[filterFn]] = filter.mock.calls
        })

        it('blocks internal messages', () => {
          expect(filterFn({
            namespace, key, payload, internal: true
          })).toBe(false)
        })

        it('lets all other messages through', () => {
          expect(filterFn({ namespace, key, payload })).toBe(true)
          expect(filterFn({ namespace: 'another namespace', key, payload })).toBe(true)
        })
      })

      describe('with a filter', () => {
        beforeEach(() => {
          engine.subscribe(fn, { namespace: 'another namespace' });

          [[filterFn]] = filter.mock.calls
        })

        it('filters messages', () => {
          expect(filterFn({ namespace, key, payload })).toBe(false)
          expect(filterFn({ namespace: 'another namespace', key, payload })).toBe(true)
        })
      })
    })
  })
})
