import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    chromeWebSecurity: false,
    baseUrl: 'https://automatenow.io/',

    /* numTestsKeptInMemory: 50 (default), --> making it 0 disables timetravel
       this also helps to log element yeild on console after clicking element */
    numTestsKeptInMemory: 50,

    experimentalMemoryManagement: true,
    requestTimeout: 90000,
    responseTimeout: 90000,
    defaultCommandTimeout: 40000,
    pageLoadTimeout: 120000,  // used for cy.visit()
    testIsolation: false,    // no logout after each it block and data is preserved across test suite
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false,
    slowTestThreshold: 180_000,
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Code to launch browser in icognito mode
      // on('before:browser:launch', (browser = {}, launchOptions) => {
      //   if(browser.family === 'chromium' || browser.name !== 'electron') {
      //     launchOptions.args.push('--incognito');
      //   }
      //   return launchOptions;
      // });

    },
  },
  env: {
  }
});
