export default class CreateInstrument {
  constructor (emit) {
    this.emit = emit
  }

  call ({ name }) {
    if (!name) {
      this.validationError()
      return
    }

    this.saveInstrument({ name })
  }

  validationError () {
    this.emit({
      namespace: 'error',
      key: 'validationError',
      payload: {
        message: 'Name and instrument type required to create an instrument'
      }
    })
  }

  saveInstrument (attributes) {
    this.emit({
      namespace: 'store',
      key: 'create',
      payload: {
        type: 'instrument',
        attributes
      }
    })
  }
}
