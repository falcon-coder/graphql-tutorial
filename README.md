# graphql-tutorial

Full Tutorial can be found at [Getting Started With GraphQL](https://falconcoder.com/2019/11/15/getting-started-with-graphql-tutorial/)

For this GraphQL introduction workshop, we'll be building an API with weather data to support clients that display information about weather station, measurements, temprature etc.

To start at the beginning of any given section, just `checkout` the branch with that name (i.e. `Chapter2`, `Chapter3`, etc.)

## Contents

### Chapter 0

> Starting branch: [master](https://github.com/falcon-coder/graphql-tutorial/tree/master)

* [Setup](#setup)
* [Organize](#organize)

> Can find final code in branch: [Chapter0](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter0)

### Chapter 1

> Starting branch: [Chapter1](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter0)

* [Creating your first Query](#creating-your-first-query)
* [Creating your first Resolver](#creating-your-first-resolver)
* [Let's get some Context](#lets-get-some-context)
* [Creating your first Connector](#creating-your-first-connector)

### Chapter 2

> Starting branch: [Chapter2](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter1Final)

* [Get Weather Station](#get-weather-station)
* [Get Measurements of Weather Station](#get-measurements-of-weather-station)
* [Limits](#limits)

### Chapter 3

> Starting branch: [Chapter3](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter2Final)

* [Queries Relationship](#query-relationships)
* [Updating Query & Schema](#updating-query-schema)
* [Updating Resolver](#updating-resolver)

### Chapter 4

> Starting branch: [Chapter4](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter3)

* [Creating your first Mutation](#creating-your-first-mutation)
* [Update Connector](#update-connector)
* [Update Resolver](#update-resolver)

### Chapter 5

> Starting branch: [Chapter5](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter4)

* [Add input type](#add-input-type)
* [Update Mutation](#update-mutation)
* [Update Resolver](#update-resolver)

### Chapter 6

> Starting branch: [Chapter6](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter5)

* [Base Error Format](#base-error-formate)
* [Add Custom Error Message](#add-custom-error-message)

> Can find final code in branch: [Chapter0](https://github.com/falcon-coder/graphql-tutorial/tree/Chapter6)

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

### Queries Relationship

Using GraphQL we can request both WeatherStation and Measurements in the same query by establishing a query relation between them.

### Updating Query & Schema

Update weatherStation query to have parameters required for measurementList in  schema.graphql

```gql
type Query {
    ...
    # weatherStation(station_id: String): WeatherStation
    weatherStation(station_id: String, type: String, limit: Int, from: Float, to: Float): WeatherStation
    ...
}
```

Update weatherStation schema to have measurementList as field in  schema.graphql

```gql
type WeatherStation {
    ...
    measurementList: [Measurement]
}
```

### Updating Resolver

We will define a new function to save passed arguments to the context in resolvers/index.js file

```gql
const saveRequestInContext = function(context, args) {
    context.request = args;
};
```

Now from weatherStation resolver, we need to call this function to save arguments in context

```gql
const resolvers = {
    Query: {
        ...
        weatherStation: (_, args, ctx) => {
            saveRequestInContext(ctx, args);
            return ctx.connectors.weatherStations.weatherStation(args);
        },
        ...
    }
};
```

We will be writing field resolver for measurementList inside WeatherStation type. Add field resolver in resolvers/index.js. Here is updated resolver looks like:

```gql
const resolvers = {
    ...
    WeatherStation: {
        measurementList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.measurementsList(ctx.request);
        }
    }
};
```
Here is how updated resolver constant will look like:
```gql
const resolvers = {
    Query: {
        weatherStationsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.weatherStationsList(args);
        },
        weatherStation: (_, args, ctx) => {
            saveRequestInContext(ctx, args);
            return ctx.connectors.weatherStations.weatherStation(args);
        },
        measurementsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.measurementsList(args);
        }
    },
    WeatherStation: {
        measurementList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.measurementsList(ctx.request);
        }
    }
};
```

1. Run npm start command
2. Open the playground again
3. Write query for weatherStation with request having parameters required for measurementList and updated query

```gql
{
  weatherStation(station_id: "your station id",
  type:"h",
  limit:100,
  from:1573039682000,
  to:1573041156900) {
    id
    latitude
    longitude
    name
    altitude
    rank
    measurementList {
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
}
```

It works! 😎

Full Tutorial can be found at [Getting Started With GraphQL](https://falconcoder.com/2019/11/15/getting-started-with-graphql-tutorial/)

### Creating your first Mutation

We know our clients need addWeatherStation support, so add your first query to schema.graphql

```gql
type Mutation {
    addWeatherStation(name: String!, 
                      externalId:String!, 
                      altitude: Int, longitude: Float, latitude: Float): WeatherStation
}
```

### Update Connector

Add addWeatherStation request in WeatherStations connector class
```gql
async addWeatherStation(args) {
    const options = {
        method: 'POST',
        uri: 'http://api.openweathermap.org/data/3.0/stations',
        qs: {
            appid: 'your appid',
        },
        body: {
            external_id: args.externalId,
            name: args.name,
            longitude: args.longitude,
            latitude: args.latitude,
            altitude: args.altitude
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

### Update Resolver

Add Mutation resolvers/index.js file

```gql
Mutation: {
    addWeatherStation: (_, args, ctx) => {
        return ctx.connectors.weatherStations.addWeatherStation(args);
    }
}
```
Updated resolvers constant will look like

```gql
const resolvers = {
    Query: {
        weatherStationsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.weatherStationsList(args);
        },
        weatherStation: (_, args, ctx) => {
            saveRequestInContext(ctx, args);
            return ctx.connectors.weatherStations.weatherStation(args);
        },
        measurementsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.measurementsList(args);
        }
    },
    WeatherStation: {
        measurementList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.measurementsList(ctx.request);
        }
    },
    Mutation: {
        addWeatherStation: (_, args, ctx) => {
            return ctx.connectors.weatherStations.addWeatherStation(args);
        }
    }
}
```
1. Run `npm start` command
2. Open the playground again
3. Request with `addWeatherStation` mutation
```gql
mutation {
  addWeatherStation(externalId: "DBL_001", 
    name:"new gql2", 
    altitude: 123,
  	longitude: 10.0,
  	latitude: 11.0) {
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

Full Tutorial can be found at [Getting Started With GraphQL](https://falconcoder.com/2019/11/15/getting-started-with-graphql-tutorial/)

### Add input type

Add input type for WeatherStationRequest

```gql
input WeatherStationRequest {
    externalId: String!
    name: String!
    longitude: Float
    latitude: Float
    altitude: Int
}
```
### Update Mutation

Update addWeatherStation mutation to take request with input type i.e. WeatherStationRequest

```gql
type Mutation {
    # addWeatherStation(name: String!, externalId:String!, altitude: Int, longitude: Float, latitude: Float): WeatherStation
    addWeatherStation(weatherStationRequest: WeatherStationRequest): WeatherStation
}
```

### Update Resolver

Update resolver to fetch WeatherStationRequest from args and pass to connector

```gql
const resolvers = {
    ...
    Mutation: {
        addWeatherStation: (_, args, ctx) => {
            return ctx.connectors.weatherStations.addWeatherStation(args.weatherStationRequest);
        }
    }
}
```
1. Run npm start command
2. Open the playground again
3. Request addWeatherStation mutation with input type
```gql
mutation {
  addWeatherStation(weatherStationRequest: { 
    externalId: "DBL_001", 
    name:"with input type", 
    altitude: 123,
  	longitude: 10.0,
  	latitude: 11.0}) {
    id
    name
    longitude
    latitude
    altitude
    rank
  }
}
```

### Base Error Format

All GraphQL errors have the same base format as defined by the GraphQLError Class provided by the graphql-js library:

```gql
{
  // error message
  message: "Syntax Error: Unexpected Name \"qury\""
  // locations (line, column) in the gql query where the error occured
  locations: [],
  // character offset in source graphql query that correspond to this error
  positions: [Number]
  // the path to the field that had an error string or number for list position
  path: [], 
  // the raw query passed into the server (debug information)
  source: {},
  // the original error thrown from a field resolver
  originalError: Error 
  // a dynamic object that can contain anything you want
  extensions: {}
}
```

### Add Custom Error Message

To return the custom error message we need to

Catch the error from downstream services
Format custom error based on our requirement
First update addWeatherStation function connectors/WeatherStations.js file

```gql
async addWeatherStation(args) {
    const options = {
        method: 'POST',
        uri: 'http://api.openweathermap.org/data/3.0/stations',
        qs: {
            appid: '77830eea801e66dc30f6fe2151ecddcd',
        },
        body: {
            external_id: args.externalId,
            name: args.name,
            longitude: args.longitude,
            latitude: args.latitude,
            altitude: args.altitude
        },
        json: true,
    };
    return request(options)
        .then(function (items) {
            return items;

        })
        .catch(function (err) {
            // We will write support to custom message here
        });
};
```

Now inside the catch block, we will add support to return a custom message

```gql
...
        .catch(function (err) {
            throw Object.assign(new Error(`Custom error message from GraphQL learning series : Status code was ${err.statusCode} (${err.error.message})`));
        });
};
```

1. Run npm start command
2. Open the playground again
3. Request addWeatherStation mutation with input type and empty externalId

```gql
mutation {
  addWeatherStation(weatherStationRequest: { 
    externalId: "DBL_001", 
    name:"with input type", 
    altitude: 123,
  	longitude: 10.0,
  	latitude: 11.0}) {
    id
    name
    longitude
    latitude
    altitude
    rank
  }
}
```

Full Tutorial can be found at [Getting Started With GraphQL](https://falconcoder.com/2019/11/15/getting-started-with-graphql-tutorial/)
