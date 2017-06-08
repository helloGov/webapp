const secrets = require('./secrets');
const currentEnv = require('./env');

let config = {
    marketing_site_url: 'http://hellogov.squarespace.com',
	marketing_pages: ['/request-beta-access', '/faq']
};

const getEnvConfig = function() {
    return require(`./envs/${currentEnv}`);
};

const envConfig = getEnvConfig();

config = Object.assign(config, envConfig, secrets);

module.exports = config;
