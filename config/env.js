'use strict';

// Adapted from create-react-app

// Grab NODE_ENV and JEKYLL_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const JEKYLL = /^JEKYLL_/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter(key => JEKYLL.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        NODE_ENV: process.env.NODE_ENV || 'development'
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
