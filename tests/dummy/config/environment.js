'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
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
    'responsive-image': [
      {
        include: 'assets/images/**/*',
        exclude: ['assets/images/small.png', 'assets/images/lqip/**/*'],
        quality: 50,
        supportedWidths: [50, 100, 640],
        lqip: {
          type: 'color',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/small.png',
        quality: 10,
        removeSource: false,
        supportedWidths: [10, 25],
      },
      {
        include: 'assets/images/lqip/inline.jpg',
        quality: 50,
        supportedWidths: [100, 640],
        lqip: {
          type: 'inline',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/lqip/color.jpg',
        quality: 50,
        supportedWidths: [100, 640],
        lqip: {
          type: 'color',
        },
        removeSource: true,
        justCopy: false,
      },
    ],
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
