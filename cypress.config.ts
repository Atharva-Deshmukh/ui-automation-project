import { defineConfig } from "cypress";
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,
    experimentalMemoryManagement: true,
    requestTimeout: 90000,
    responseTimeout: 90000,
    defaultCommandTimeout: 40000,
    pageLoadTimeout: 120000,
    testIsolation: false,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false,
    includeShadowDom: true,
    slowTestThreshold: 180_000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        createFiles({ numberOfFiles, sizeInMB, directory }) {
          const dirPath = path.resolve(directory);
    
          // Ensure the directory exists
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
    
          for (let i = 0; i < numberOfFiles; i++) {
            const filePath = path.join(dirPath, `file_${i}.txt`);
            const data = '0'.repeat(sizeInMB * 1024 * 1024); // Generate 10 MB of '0' characters
    
            fs.writeFileSync(filePath, data);
          }
    
          return null; // indicate the task is complete
        }
      });
      
    },
  },
});


/*
createFiles({ numberOfFiles, sizeInMB, directory }) {
        const dirPath = path.resolve(directory);
  
        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
  
        for (let i = 0; i < numberOfFiles; i++) {
          const filePath = path.join(dirPath, `file_${i}.txt`);
          const data = '0'.repeat(sizeInMB * 1024 * 1024); // Generate 10 MB of '0' characters
  
          fs.writeFileSync(filePath, data);
        }
  
        return null; // indicate the task is complete
      }
*/