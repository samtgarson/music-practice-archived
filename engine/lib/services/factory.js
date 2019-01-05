import { filter } from 'rxjs/operators'

export default (scope, services) => function Service (bus) {
  const subscription = bus
    .pipe(filter(({ namespace }) => namespace === scope))
    .subscribe(({ key, payload, id }) => {
      const emit = message => bus.next({ id, ...message })

      const svc = new services[key](emit)
      svc.call(payload)
    })

  this.unsubscribe = () => subscription.unsubscribe()
}
