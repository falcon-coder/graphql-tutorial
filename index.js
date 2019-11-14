'use strict';
const {GraphQLServer} = require('graphql-yoga');
const typeDefs = ['./schema/schema.graphql'];
const resolvers = require('./resolvers');
const connectors = require('./connectors');
const context = {connectors};

const server = new GraphQLServer({typeDefs, resolvers, context});

server.start(() => console.log('Server is running on http://localhost:4000'));