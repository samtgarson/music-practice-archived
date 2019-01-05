![music-practice](https://raw.githubusercontent.com/feathericons/feather/master/icons/music.svg?sanitize=true)

[**music-practice**](https://github.com/samtgarson/music-practice) — practice your musical instrument

# Engine

This module contains the core business domain engine which will drive all business domain-related interactions. It exposes a message-bus-like interface, allowing modules to emit and subscribe to messages to interact with internal services ("use cases").

Relies on [rxjs](https://github.com/ReactiveX/rxjs) as an message bus of sorts.

## Usage

Create a new engine. You can pass an optional `{ debug: true }` to log events sent through the engine.
```js
const engine = new Engine()
```

Send a message to trigger an interaction. You must include the event key (in the format `namespace:key`), and an optional payload and options object. Use the returned object to catch an error triggered by this message.

```js
engine
  .emit('instruments:create', { name: 'piano' })
  .catch(e => console.error(e))
```

You can also subscribe to other messages, consider this plugging into a "port". Pass a handler to receive messages from the engine, and also an optional filter object. _Currently the only filterable attribute is namespace._

```js
engine.subscribe(e => console.log(e), { namespace: 'instruments' })
```

## Internals

The engine works by registering a number of services, each with a set of service objects. Every message that is emitted on the engine is fanned out to all services, which can act on them if they choose.

While this means everything is quite loosely coupled so it is sometimes hard to follow an action around the codebase, it means it's easy to plug 'n' play different adapters for different purposes.

## Contribute

Uses [Jest](https://github.com/facebook/jest) to test.

```bash
git clone git@github.com:samtgarson/music-practice.git

cd engine
npm i
npm run test --watch
```
