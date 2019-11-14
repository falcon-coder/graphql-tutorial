'use strict';

const resolvers = {
    Query: {
        weatherStationsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.weatherStationsList(args);
        }
    },
};

module.exports = resolvers;