import { defineConfig } from 'cypress';
import { dev_int_1_vars } from './dev_int_1_env_vars';
import { dev_int_2_vars } from './dev_int_2_env_vars';
import { initPlugin } from 'cypress-plugin-snapshots/plugin';

let config: Cypress.ConfigOptions;

const env = process.env.ENV_1_OR_ENV_2;
const whereToTest = env;

const generateTestSpecPattern = () => {
  return `cypress/e2e/**/*.cy.ts`;
};

/* Defining type for common config options */
type ExtendedConfigOptions =
  | Cypress.Omit<Partial<Cypress.Omit<Cypress.ResolvedConfigOptions, Cypress.TestingType>>, 'indexHtmlFile'>
  | { testTimeout: number };

const commonConfigOptions: ExtendedConfigOptions = {
    setupNodeEvents(on, config) {

        // Register cypress-plugin-snapshots tasks, Since snapshots are used in every tests
        initPlugin(on, config);
    },

    testTimeout: 200_000,
    taskTimeout: 300000,  // Increase timeout to 5 minutes for CI
};

switch (whereToTest) {
  case 'ENV1':
    console.log('Inside ENV1. Testing Env is  https://www.google.com/intl/en_in/chrome/');
    config = {
      e2e: {
        baseUrl: 'https://www.google.com/intl/en_in/chrome/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: dev_int_1_vars
      },
    };
    break;
  case 'ENV2':
    console.log('Inside ENV2. Testing Env is  https://www.google.com/intl/en_in/chrome/');
    config = {
      e2e: {
        baseUrl: 'https://www.google.com/intl/en_in/chrome/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: dev_int_2_vars
      },
    };
    break;
}

export default defineConfig(config);

