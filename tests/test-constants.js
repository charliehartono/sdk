// The constants below are used for examples and tests

require('dotenv').config();

const DefaultFullNodeEndpoint = 'ws://localhost:9944';
const DefaultTestKeyringType = 'sr25519';
const DefaultTestAccountURI = '//Alice';

function fromEnv(varName, defaultVal) {
  // eslint-disable-next-line no-undef
  if (varName in process.env) {
    // eslint-disable-next-line no-undef
    return process.env[varName];
  } else if (defaultVal !== undefined) {
    return defaultVal;
  } else {
    throw new Error(`Environment variable "${varName}" not defined`);
  }
}

export const FullNodeEndpoint = fromEnv('FullNodeEndpoint', DefaultFullNodeEndpoint);
export const TestKeyringOpts = {type: fromEnv('TestKeyringType', DefaultTestKeyringType)};
export const TestAccountURI = fromEnv('TestAccountURI', DefaultTestAccountURI);
