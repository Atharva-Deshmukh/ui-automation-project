import { defineConfig } from "cypress";
import fs from 'fs';

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    chromeWebSecurity: false,
    scrollBehavior: false,  // to prevent cypress' default behaviour to scroll elements into focus

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

                                              // DEFINING TASKS HERE
      on('task', {
        noParam: noParam,
        singleParam: singleParam,
        multipleParams: multipleParams,
        readExcel: readExcel,
      });

      // WAY-2 of defining tasks
      // Cypress automatically merges on('task') objects.
      
      /* Defined outside defineConfig():

            const myTask = {
        readFileMaybe(filename) {
            if (fs.existsSync(filename)) {
              return fs.readFileSync(filename, 'utf8')
            }

            return null
          },
        }

        on('task', myTask)

      */

        

      

                                            // Function definitions
      function noParam() {
        return 'No Param';
      }

      function singleParam(paramPassed: number) {
        return paramPassed;
      }

      function multipleParams(inputObj) {
        return inputObj.Name + ' ' + inputObj.Age;
      }


      /* -------------------------Excel related Tasks---------------------------- */

      /**
       * Returns excel data as JSON array in both row wise format or column wise format
       *  filePath: The path to the Excel file.
       * sheetName: The name of the sheet from which you want to extract data.
       * returnType: Can be either 'column' or 'row' depending on whether you want to fetch column data or row data.
       * columnName: The name of the column to extract (when returnType is 'column').
       * Error Handling: The task handles cases where the column doesn’t exist and returns a custom error message. */

      function readExcel({ filePath, sheetName, returnType, columnName }) {
        try {
          const file = fs.readFileSync(filePath); // Read the file
          const workbook = xlsx.read(file, { type: 'buffer' }); // Parse the file

          const worksheet = workbook.Sheets[sheetName]; // Get the specific sheet
          const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON array (header: 1 to include headers)

          if (returnType === 'column') {
            const headerRow = jsonData[0]; // Get headers
            const columnIndex = (headerRow as any).indexOf(columnName); // Get column index

            if (columnIndex === -1) {
              throw new Error(`Column "${columnName}" not found`);
            }

            // Fetch the data for the specified column
            const columnData = jsonData.slice(1).map(row => row[columnIndex]);
            return columnData;

          } else if (returnType === 'row') {
            // Return the entire row-wise data (except header)
            return jsonData.slice(1);
          }
        } catch (err) {
          return { error: err.message };
        }
      }
    },
  },


  env: {
  }
});
