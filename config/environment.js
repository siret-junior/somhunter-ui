"use strict";

const config_core = require("../../somhunter-core/config/config-core.json");


const core_port_hn = config_core.core.API.hostname;
const core_port = config_core.core.API.port;
const data_server_port_hn = config_core.data_server.API.hostname;
const data_server_port = config_core.data_server.API.port;

module.exports = function (environment) {
    let ENV = {
        modulePrefix: "somhunter-ui",
        environment,
        rootURL: "/",
        locationType: "auto",

        coreUrl: `${core_port_hn}:${core_port}`,
        settingsEndpoint: `/config`, //< This is the first request we do, without the config UI cannot function
        dataServerUrl: `${data_server_port_hn}:${data_server_port}`, // non-HTTPS

        logLevel: 4, // 0 => nothing, 1 => +Errors, 2=> +Info, 3 => +Warnings, 4 => +Debug

        debug: true,
        collectorMode: false, // To see collector buttons & stuff


        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false,
            },
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
    };

    if (environment === "development") {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === "test") {
        ENV.debug = false;
        // Testem prefers this...
        ENV.locationType = "none";

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = "#ember-testing";
        ENV.APP.autoboot = false;
    }

    if (environment === "production") {
        // here you can enable a production-specific feature
    }

    return ENV;
};
