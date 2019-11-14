'use strict';
const WeatherStations = require('./WeatherStations');

const connectors = {
    weatherStations: new WeatherStations(),
};

module.exports = connectors;