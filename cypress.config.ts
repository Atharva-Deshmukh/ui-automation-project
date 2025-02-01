import { defineConfig } from "cypress";
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit'; // Correct import

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
        },

        writeFile({ filePath, sizeInMB }) {
          return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
        
            // Create a writable stream to the specified file path
            const writeStream = fs.createWriteStream(path.resolve(filePath));
            
            writeStream.on('finish', () => {
              resolve(null); // Resolve when the write stream finishes
            });
        
            writeStream.on('error', (err) => {
              reject(err); // Reject the promise on stream error
            });
        
            doc.pipe(writeStream);
        
            // Logic to create a PDF of specific size
            const totalSizeInBytes = sizeInMB * 1024 * 1024;
        
            // Calculate how many '0's we need to fill the specified size
            const numOfZeros = Math.floor(totalSizeInBytes / 2); // Each '0' is roughly 1 byte (for simplicity)
        
            // Write the '0's to fill the page
            doc.fontSize(12).text('0'.repeat(numOfZeros), { align: 'left' });
        
            // Finalize the PDF and end the stream
            doc.end();
          });
        }
      });
    },
  },
  env: {
    hideXHRInCommandLog: false,
    baseUrl: 'https://demo.automationtesting.in/',
  }
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