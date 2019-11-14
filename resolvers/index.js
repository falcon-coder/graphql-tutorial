'use strict';

const resolvers = {
    Query: {
        weatherStationsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.weatherStationsList(args);
        },
        weatherStation: (_, args, ctx) => {
            return ctx.connectors.weatherStations.weatherStation(args);
        },
        measurementsList: (_, args, ctx) => {
            return ctx.connectors.weatherStations.measurementsList(args);
        }
    },
};

module.exports = resolvers;