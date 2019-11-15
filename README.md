# graphql-tutorial

For this GraphQL introduction workshop, we'll be building an API with weather data to support clients that display information about weather station, measurements, temprature etc.

To start at the beginning of any given section, just `checkout` the branch with that name (i.e. `Chapter2`, `Chapter3`, etc.)

## Contents

### Chapter 0

> Starting branch: [master](https://github.com/falcon-coder/graphql-tutorial/tree/master)

* [Setup](#setup)
* [Organize](#organize)

> Can find final code in branch: [Chapter0](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter0)

### Chapter 1

> Starting branch: [Chapter1](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter1)

* [Creating your first Query](#creating-your-first-query)
* [Creating your first Resolver](#creating-your-first-resolver)
* [Let's get some Context](#lets-get-some-context)
* [Creating your first Connector](#creating-your-first-connector)

### Chapter 2

> Starting branch: [Chapter2](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter2)

* [Get Weather Station](#get-weather-station)
* [Get Measurements of Weather Station](#get-measurements-of-weather-station)
* [Limits](#limits)

### Chapter 3

* [Graph Relationships](#graph-relationships)

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

## Creating your first Query

We know our clients need `workStationsList` information, so add your first query to `schema.graphql`

```gql
type Query {
    weatherStationsList: [WeatherStation]
}
```

This query will allow our clients to search for weather stations and get an array of results!

We need to define what an WeatherStation is, so add the `WeatherStation` type to your `schema.graphql`

```gql
type WeatherStation {
    id: String
    name: String
    longitude: Float
    latitude: Float
    altitude: Int
    rank: Int
}
```

Note: These fields are determined by the needs of the clients.

Awesome! But how do we actually return data?

## Creating your first Resolver

Add an `weatherStationsList` resolver to `resolvers/index.js`

```js
'use strict';

const resolvers = {
    Query: {
        weatherStationsList: (root, args) => {
            return [];
        },
    },
};

module.exports = resolvers;
```

Open the playground at <http://localhost:4000> and send a query for `WeatherStation`

```gql
{
  weatherStationsList {
    id
    name
    longitude
    latitude
    altitude
    rank
  }
}
```

You'll receive empty data, but at least we have something executing!

## Let's get some Context

Resolvers take in 4 parameters: `root`, `args`, `context`, and `info`.

* `root` the value of the previous execution level
* `args` any field-level arguments
* `context` an object containing any data that should be made available to all resolvers (think logging functions, session information, data sources, etc.)
* `info` an object containing information about the query such as the selection set, the AST of the query, parent info, etc.

## Creating your first Connector

Most GraphQL services follow some sort of `connector` pattern. The idea here is to have a layer on top of a database/backend driver that has GraphQL-specific error handling, logging, batching, and/or caching. We'll touch more on these topics later. For now, let's just think of it as our data source.

You guessed it! The connector will go on the `context`.

Let's create a new folder called `connectors` with an `index.js`

```js
'use strict';

const connectors = {};

module.exports = connectors;
```

In our main `index.js`, let's import that file and update our server:

```js
...
const connectors = require('./connectors');
const context = {connectors};

const server = new GraphQLServer({typeDefs, resolvers, context});
...
```

Let's add a new file, `connectors/WeatherStations.js`

```js
'use strict';

class WeatherStations {}

module.exports = WeatherStations;
```

and import it into `connectors/index.js`

```js
'use strict';
const weatherStations = require('./WeatherStations');

const connectors = {
    weatherStations: new WeatherStations(),
};

module.exports = connectors;
```

In our `WeatherStations` connector, we know we're going to need to make an HTTP request to the Weather API, so let's kill our server to install some dependencies and then start it back up

```json
        "request": "^2.85.0",
        "request-promise": "^4.2.2"
```

Now we can make HTTP calls!

At the top of `connectors/WeatherStations.js`, require our new dependency

```js
const request = require('request-promise');
```

And let's add our first method to the `iTunes` class

```js
async weatherStationsList() {
        const options = {
            uri: 'http://api.openweathermap.org/data/3.0/stations',
            method: 'GET',
            qs: {
                appid: 'weather appid'
            },
            json: true,
        };

        const items = await request(options);
        if (!items) {
            return null;
        }

        return items;
};
```

Now we can go back to `resolvers/index.js` and consume this connector from our `context`

```js
weatherStationsList: (_, args, ctx) => {
    return ctx.connectors.weatherStations.weatherStationsList(args);
}
```

And that's it!

You can open the [playground](http://localhost:4000) again and send a query for `WeatherStations`:

```gql
{
  weatherStationsList {
    id
    name
    longitude
    latitude
    altitude
    rank
  }
}
```

It works! 😎

## Get Weather Station

Add a new `Query` for `weatherStation`

```gql
weatherStation(station_id: String): WeatherStation
```

Let's add another method to the `WeatherStations` connector

```js
async weatherStation(args) {
    const options = {
        uri: 'http://api.openweathermap.org/data/3.0/stations/' + args.station_id,
        method: 'GET',
        qs: {
            appid: 'weather appid'
        },
        json: true,
    };

    const station = await request(options);
    if (!station) {
        return null;
    }
    return station;
};
```

and add a resolver for the `weatherStation` query

```js
weatherStation: (_, args, ctx) => {
    return ctx.connectors.weatherStations.weatherStation(args);
}
```

Open the [playground](http://localhost:4000) again and send a query for `weatherStation`

```gql
{
  weatherStation(station_id: "your station_id") {
    id
    name
    longitude
    latitude
    altitude
    rank
  }
}
```

But that's more data than our clients need!

## Get Measurements of Weather Station

Add a new `Query` for `measurementsList`

```gql
measurementsList(station_id: String, type: String, limit: Int, from: Float, to: Float) : [Measurement]
```

We need to define what an `Measurement` is, so add the `Measurement` type to your schema.graphql
`Temperature` is also one of the type defined inside Measurement

```gql
type Measurement {
    type: String
    date: String
    station_id: String
    temp : Temp
}

type Temp {
    max: Float
    min: Float
    average: Float
    weight: Int
}
```

Let's add another method to the `WeatherStations` connector

```js
async measurementsList(args) {
    const options = {
        uri: 'http://api.openweathermap.org/data/3.0/measurements',
        method: 'GET',
        qs: {
            station_id: args.id,
            type: args.type,
            limit: args.limit,
            from: args.from,
            to: args.to,
            appid: 'weather appid'
        },
        json: true,
    };

    const measurements = await request(options);
    if (!measurements) {
        return null;
    }
    return measurements;
};
```

and add a resolver for the `weatherStation` query

```js
measurementsList: (_, args, ctx) => {
    return ctx.connectors.weatherStations.measurementsList(args);
}
```

Open the [playground](http://localhost:4000) again and send a query for `measurementsList`

```gql
{
  measurementsList(station_id: "weather station_id",
  type:"h",
  limit:100,
  from:1573039682000,
  to:1573041156900) {
    type
    date
    station_id
    temp {
      max
      min
      average
      weight
    }
  }
}
```

But that's more data than our clients need!

## Limits

Let's add some limiting to our queries so the clients can specify how many results they need.

Actually if you observe, in measurementsList `schema`, limit functionality is already implemented with input parameters `from` and `to`.

When you request with `from` and `to` dates/timestamp, measurementsList API will return all the measuremnts fall between this bucket. 

