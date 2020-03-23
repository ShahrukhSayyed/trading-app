let appConfig = {};

appConfig.port = 9000;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";


module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
};

