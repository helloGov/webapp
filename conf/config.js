require('dotenv').config()
const currentEnv = process.env.NODE_ENV;

let config = {
    marketingSiteUrl: 'http://hellogov.squarespace.com',
    marketingPages: ['/request-beta-access', '/faq'],
    dbIP:   "127.0.0.1",
    dbPort: '27017',
    fbCallbackUrl: 'http://localhost:8080/auth/facebook/callback',
    appPort: '8080',
    marketingSiteUrl: 'http://hellogov.squarespace.com',
    hellogovDomain: `http://localhost:8080`,
    supportEmail: 'hellogovapp@gmail.com',
    noreplyEmail: 'hellogovapp@gmail.com',
};

let secrets = {
    dbLocalUser: `${process.env.LOCAL_DB_USER}`,
    dbLocalPassword: `${process.env.LOCAL_DB_PASSWORD}`,
    dbUser: `${process.env.DB_USER}`,
    dbPassword: `${process.env.DB_PASSWORD}`,
    db: `${process.env.DB_NAME}`,
    dbStage: `${process.env.DB_STAGE}`,
    sessionSecret: `${process.env.SESSION_SECRET}`,
    fbAppId: `${process.env.FB_APP_ID}`,
    fbAppSecret: `${process.env.FB_APP_ID}`,
    emailServiceUser: `${process.env.SMTP_Injection}`,
    emailServicePassword: `${process.env.EMAIL_SERVICE_PASSWORD}`,
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
    openStatesApiKey: `${process.env.OPENSTATES_API_KEY}`,
    googleCivicInfoApiKey: `${process.env.GOOGLE_CIVIC_INFO_API_KEY}`
};

const getEnvConfig = function() {
    return require(`./envs/${currentEnv}`);
};

const envConfig = getEnvConfig();

config = Object.assign(config, envConfig, secrets);

module.exports = config;
