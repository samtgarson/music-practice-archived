import Engine from '../../lib'

describe('Creating an instrument', () => {
  let engine
  let errorCb
  let observer
  let args = {}

  beforeEach(() => {
    errorCb = jest.fn()
    observer = jest.fn()
    engine = new Engine()
    engine.subscribe(observer)

    engine.emit('instruments:create', args).catch(errorCb)
  })

  afterEach(() => {
    engine.end()
  })

  describe('without valid params', () => {
    beforeAll(() => {
      args = {}
    })

    it('calls the error callback', () => {
      expect(errorCb).toHaveBeenCalledWith({ message: 'Name and instrument type required to create an instrument' })
    })

    it('does not save anything to the store', () => {
      expect(observer).not.toHaveBeenCalledWith('store:create', expect.any(Object))
    })
  })

  describe('with valid params', () => {
    beforeAll(() => {
      args = {
        name: 'piano'
      }
    })

    it('saves the instrument to the store', () => {
      expect(observer).toHaveBeenCalledWith('store:create', { attributes: args, type: 'instrument' })
    })
  })
})
