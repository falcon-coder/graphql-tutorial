# graphql-tutorial

For this GraphQL introduction workshop, we'll be building an API with weather data to support clients that display information about weather station, measurements, temprature etc.

To start at the beginning of any given section, just `checkout` the branch with that name (i.e. `Chapter2`, `Chapter3`, etc.)

## Contents

### Part 1

> Starting branch: [master](https://github.com/falcon-coder/graphql-tutorial/tree/master)

* [Setup](#setup)
* [Organize](#organize)

### Part 2

> Starting branch: [part2](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter2)

* [Creating your first Query](#creating-your-first-query)
* [Creating your first Resolver](#creating-your-first-resolver)
* [Let's get some Context](#lets-get-some-context)
* [Creating your first Connector](#creating-your-first-connector)

## Setup

Clone the project & `cd` into it

```bash
$ git clone git@github.com:falcon-coder/graphql-tutorial.git
$ cd graphql-tutorial
```

Install the dev dependencies

```bash
$ npm install
```

Install [graphql-yoga](https://github.com/graphcool/graphql-yoga) (the GraphQL server)

you can add it to your package.json file:
```json
    "dependencies": {
        "graphql-yoga": "^1.13.1"
    },
```
Or you can install it with npm:

```bash
$ npm i graphql-yoga@1.13.1
```

Copy the boilerplate code into `index.js`

```js
'use strict';
const {GraphQLServer} = require('graphql-yoga');

const typeDefs = `
    type Query {
        hello(name: String): String!
    }
`;

const resolvers = {
    Query: {
        hello: (_, {name}) => `Hello ${name || 'World'}`,
    },
};

const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log('Server is running on http://localhost:4000'));
```

At this point, you should be able to run `npm start` and navigate to <http://localhost:4000> to see the demo server's playground.

## Organize

Let's organize things a little better!

Go ahead and delete the demo `typeDefs` and `resolvers` from `index.js`.

Create a folder called `resolvers` and add an `index.js` to it.

Create another folder called `schema` and add a file named `schema.graphql` to it.

Now we need to import these into our `index.js`.

Your `index.js` should look like this:

```js
'use strict';
const {GraphQLServer} = require('graphql-yoga');
const typeDefs = ['./schema/schema.graphql'];
const resolvers = require('./resolvers');

const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log('Server is running on http://localhost:4000'));
```

Go ahead and start your server with `npm start`. Your server will automatically restart each time we make changes.
