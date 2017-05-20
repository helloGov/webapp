const secrets = require('../secrets');

let config = {
    protocol: 'http',
    hostname: `localhost:${secrets.app_port}`
};

module.exports = config;
