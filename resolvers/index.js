'use strict';

const saveRequestInContext = function(context, args) {
    context.request = args;
};


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
            return ctx.connectors.weatherStations.addWeatherStation(args.weatherStationRequest);
        }
    }
}

module.exports = resolvers;