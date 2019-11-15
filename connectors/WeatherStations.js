'use strict';

const request = require('request-promise');

class WeatherStations {
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

    async measurementsList(args) {
        const options = {
            uri: 'http://api.openweathermap.org/data/3.0/measurements',
            method: 'GET',
            qs: {
                station_id: args.station_id,
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

}

module.exports = WeatherStations;