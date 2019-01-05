![music-practice](https://raw.githubusercontent.com/feathericons/feather/master/icons/music.svg?sanitize=true)

**music-practice** — practice your musical instrument


<!-- _Components_ [Engine](https://github.com/samtgarson/music-practice/tree/master/engine) -->

## Background

This project is an excuse for me to play around with unfamiliar technology and ways of building software. I wanted a to play around with ideas like _Hexagonal_ or _Clean Architecture_, and try separating out an app with not-insignificant business logic into a core "engine", which would allow plugging various data store and UI adapters. Loose ideas: 

- Ensure the engine contains only business logic
- Ensure the interaction layer is agnostic to data store and UI, and define a clean API to represent "ports"
- In general try to keep data flow strictly state-based and in one direction
- Shoehorn in unfamiliar tech in the name of knowledge (e.g. Oberserables? Web sockets?)

## Milestones

- Build the business domain engine
- Build a CLI UI layer (using [oclif](https://github.com/oclif/oclif)?)
- Build an API layer (using GraphQL and a more permanent persistence layer?)
- Build a mobile app layer (using [NativeScript Vue](https://nativescript-vue.org)?)

## Features

To make this worthwhile the featureset of the app had to be based on something substantial; I recently attempted learning the keyboard so an app that helped me learn music theory and practice seemed like a good candidate, especially with libraries like [music-fns](https://github.com/madewithlove/music-fns) and [teoria](https://github.com/saebekassebil/teoria) which allow complex interaction with music theory concepts in code.

Some ideas:

- Learn and practice scales and key signatures
- Keep track of progress over time
- Practice diatonic intervals
- Practice whole songs or charts
