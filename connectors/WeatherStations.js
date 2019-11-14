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
}

module.exports = WeatherStations;