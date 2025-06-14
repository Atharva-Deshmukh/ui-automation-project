config.ts

import { defineConfig } from 'cypress';
import { dev_bxlct_EnvVars } from './cypress_config_dev_bxlct_env_vars';
import { dev_lct_EnvVars } from './cypress_config_dev_lct_env_vars';
import { dev_msi_EnvVars } from './cypress_config_dev_msi_env_vars';
import { prod_bxlct_EnvVars } from './cypress_config_prod_bxlct_env_vars';
import { prod_lct_EnvVars } from './cypress_config_prod_lct_env_vars';
import { prodint_bxlct_EnvVars } from './cypress_config_prodint_bxlct_env_vars';
import { prodint_lct_EnvVars } from './cypress_config_prodint_lct_env_vars';

const { initPlugin } = require('cypress-plugin-snapshots/plugin');
// const https = require('https');
// const axios = require('axios');   // uncomment after installing this modules again when needed
const xlsx = require('xlsx');


import { tagify } from 'cypress-tags';
import { unlinkSync } from "fs";
import { error } from 'console';
// import fs from 'fs';

// Require these for pdf and zip processing
const AdmZip = require('adm-zip');
const path = require('path');
const pdf = require('pdf-parse');
const fs = require('fs-extra');

const glob = require('glob');
const util = require('util');
const globPromise = util.promisify(glob);

const Imap = require('node-imap');
const simpleParser = require('mailparser').simpleParser;
let i = 0;

const env = process.env.E2E_TEST_LCT_OR_BXLCT;
const test_against = process.env.TEST_AGAINST;
const cypress_tags = process.env.TAGS;
const whereToTest = env + '_' + test_against;
let folder = process.env.TEST_SPEC_DIRECTORY;
let config: Cypress.ConfigOptions;

const generateTestSpecPattern = () => {
  return `cypress/e2e/${folder}/**/*${env}_*.spec.{js,jsx,ts,tsx}`;
};

const { verifyDownloadTasks } = require('cy-verify-downloads');

type ExtendedConfigOptions =
  | Cypress.Omit<Partial<Cypress.Omit<Cypress.ResolvedConfigOptions, Cypress.TestingType>>, 'indexHtmlFile'>
  | { testTimeout: number };

const commonConfigOptions: ExtendedConfigOptions = {
  setupNodeEvents(on, config) {
    // console.log("**********************")
    // console.log(config)
    initPlugin(on, config);
    config.env.CYPRESS_INCLUDE_TAGS = cypress_tags;
    // const prepareConfig = Promise.resolve(require('./cypress/plugins/index.ts')(on, config));
    on('file:preprocessor', tagify(config));
    on('task', verifyDownloadTasks);
    on('task', {
      readScreenshot(filePath) {
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'base64');
        }
        return null;
      },
      removeDirectory(folderPath) {
        return new Promise((resolve, reject) => {
          fs.rmdir(folderPath, { recursive: true }, (err) => {
            if (err) {
              console.error(`Failed to remove directory: ${folderPath}`, err);
              reject(err);
            } else {
              console.log(`Successfully removed directory: ${folderPath}`);
              resolve(null);
            }
          });
        });
      }  
    });
    // on('after:screenshot', details => {
    //   const newPath = `mochawesome-report/${details.specName}.png`;
    //   return new Promise((resolve, reject) => {
    //     fs.rename(details.path, newPath, err => {
    //       if (err) return reject(err);
    //       resolve({ path: newPath });
    //     });
    //   });
    // });

    on('after:screenshot', details => {
      const pathGroups = details.path
        .replace(/( -- after all hook| -- before all hook| -- before each hook| -- after each hook)/g, '')
        .match(/(.*mochawesome-report)(.*)/);

      const filePath = pathGroups[1];

      const fileNameArray = pathGroups[2].split('--').map(n => n.trim());

      let newName = fileNameArray
        .pop()
        .replace(/[/\\?%*:|"<>]/g, '')
        .replace(/  +/g, ' ');
      if (newName.includes('.ts')) newName = newName.split('.ts')[1];
      const newPath = `${filePath}/${details.specName}/${newName}`;

      return new Promise((resolve, reject) => {
        require('fs-extra').rename(details.path, newPath, err => {
          if (err) return reject(err);
          resolve({ path: newPath });
        });
      });
    });

    on('after:spec', (spec, results) => {

      try {
        const splitName = spec.name.split('/');
        const filename = `${splitName[splitName.length - 1].split('_')[0]}_failedTests.txt`;
        let currentValue = 0;
        let valueToWrite = 0;

        if (fs.existsSync(filename)) {
          // eslint-disable-next-line radix
          currentValue = parseInt(String(fs.readFileSync(filename)));
        }
        if (results?.stats) valueToWrite = (results.stats.failures ? 1 : 0) + currentValue;

        fs.writeFileSync(filename, String(valueToWrite));
      } catch (err) {
        console.error('Failed to write:', err);
      }


      if (config.video) {
        if (results.stats.failures || results.stats.skipped) {
          console.log('Keeping video for these tests');
        } else {
          console.log('Deleting video...');
          unlinkSync(results.video);
        }
      }

        // Video Logic - Custom
      // if (results && results.stats.failures === 0) {
      //               // Dynamically import fs and path modules
      //               const fspromises = require('fs/promises');
      //               const path = require('path');
      //   try {
      //     const videoPath = path.join(config.videosFolder, spec.baseName + '.mp4');

      //     fspromises.unlink(videoPath);
      //     console.log('Deleted passed test video:', videoPath);
      //   } catch (err) {
      //     console.error('Failed to delete passed test video:', err);
      //   }
      // } else {
      //   try {
      //     const fspromises = require('fs/promises');
      //               const path = require('path');
      //     // Dynamically import ffmpeg to compress the video if tests failed
      //     const ffmpeg = require('fluent-ffmpeg');
      //     const videoPath = path.join(config.videosFolder, spec.baseName + '.mp4');

      //     ffmpeg(videoPath)
      //       .videoCodec('libx264')
      //       .outputOptions('-crf 35')
      //       .save(videoPath.replace('.mp4', '_compressed.mp4'))
      //       .on('end', async () => {
      //         await fspromises.unlink(videoPath);
      //         console.log('Compressed and deleted original video:', videoPath);
      //       });
      //   } catch (err) {
      //     console.error('Failed to compress video:', err);
      //   }
      // }
    });

    // Wrapped all the tasks under on task instance with headings separating the categories of the tasks
    on('task', {

      /* -------------------------Excel related Tasks---------------------------- */

      /**
       * Returns excel data as JSON array in both row wise format or column wise format
       *  filePath: The path to the Excel file.
       * sheetName: The name of the sheet from which you want to extract data.
       * returnType: Can be either 'column' or 'row' depending on whether you want to fetch column data or row data.
       * columnName: The name of the column to extract (when returnType is 'column').
       * Error Handling: The task handles cases where the column doesn’t exist and returns a custom error message. */

      readExcel({ filePath, sheetName, returnType, columnName }) {
        try {
          const file = fs.readFileSync(filePath); // Read the file
          const workbook = xlsx.read(file, { type: 'buffer' }); // Parse the file

          const worksheet = workbook.Sheets[sheetName]; // Get the specific sheet
          const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON array (header: 1 to include headers)

          if (returnType === 'column') {
            const headerRow = jsonData[0]; // Get headers
            const columnIndex = headerRow.indexOf(columnName); // Get column index

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
      },


      /* -------------------------Mail related Tasks---------------------------- */
      getEmails({ email, password }) {
        const imap = new Imap({
          user: email,
          password: password,
          host: 'imap.gmail.com',
          port: 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false },
          timeout: 90000
        });

        return new Promise((resolve, reject) => {
          imap.once('ready', () => {
            imap.openBox('INBOX', false, (err: any, mailbox: any) => {
              if (err) {
                imap.end();
                reject(err);
              }
              // Search for the latest received email
              // Search for emails
              const emails: any = [];
              if (mailbox.messages.total == 0) {
                imap.end();
                resolve(emails);
              }
              imap.search(['ALL'], (searchErr: any, results: string | any[]) => {
                i++;
                if (results.length == 0) resolve(emails);
                if (searchErr) throw searchErr;
                // Fetch email headers and bodies for the latest received email
                try {
                  const fetched = imap.fetch(results, { bodies: '' });
                  fetched.on(
                    'message',
                    (
                      msg: {
                        on: (arg0: string, arg1: (stream: any, info: any) => void) => void;
                        once: (arg0: string, arg1: () => void) => void;
                      },
                      seqno: number
                    ) => {
                      const emailParts: string[] = [];

                      msg.on('body', (stream, info) => {
                        // Accumulate email parts
                        let buffer = '';

                        stream.on('data', (chunk: { toString: (arg0: string) => string }) => {
                          buffer += chunk.toString('utf8');
                        });

                        stream.on('end', () => {
                          const header = Imap.parseHeader(buffer);
                          emailParts.push(buffer);
                          emailParts.push(header);
                        });
                      });

                      msg.once('end', () => {
                        // Parse the email
                        const emailText = emailParts.join('');
                        simpleParser(
                          emailText,
                          (
                            parseErr: any,
                            parsedEmail: {
                              subject: any;
                              text: any;
                              from: { text: any };
                              to: { text: any };
                              date: { toString: () => any };
                            }
                          ) => {
                            if (parseErr) {
                              imap.end();
                              reject(parseErr);
                            }

                            // Extract the email subject
                            const subject = parsedEmail.subject;

                            // Extract the email body
                            const body = parsedEmail.text;

                            // Extract the email "From" field
                            const from = parsedEmail.from.text;

                            // Extract the email "To" field
                            const to = parsedEmail.to.text;

                            // Extract the email "date" field
                            const date = parsedEmail.date.toString();

                            // Return the email details
                            emails.push({ subject, body, from, to, date });

                            if (seqno == results.length) resolve(emails);
                          }
                        );
                      });
                    }
                  );

                  fetched.on('end', () => {
                    imap.end();
                  });
                } catch (error) {
                  console.error(error);
                  reject(error);
                }
              });
            });
          });

          imap.connect();
        });
      },

      deleteEmails({ email, password }) {
        const imap = new Imap({
          user: email,
          password: password,
          host: 'imap.gmail.com',
          port: 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false },
          timeout: 90000
        });
        let deletedMessagecount = 0;
        return new Promise((resolve, reject) => {
          imap.connect();

          imap.once('ready', () => {
            imap.openBox('INBOX', false, (err: any, box: any) => {
              if (err) throw err;

              imap.search(['ALL'], (err: any, messages: any[]) => {
                if (err) throw err;
                deletedMessagecount = messages.length;
                messages.forEach(message => {
                  imap.addFlags(message, 'Deleted', (err: any) => {
                    if (err) throw err;
                    console.log(`Message ${message} has been deleted`);
                  });
                });

                imap.expunge((err: any) => {
                  if (err) throw err;
                  resolve(deletedMessagecount);
                  console.log('All deleted messages have been permanently removed from the mailbox');
                  imap.end();
                });
              });
            });
          });

          imap.once('error', (err: any) => {
            console.log(err);
          });
        });
      },

      getEmailCount({ email, password }) {
        const imap = new Imap({
          user: email,
          password: password,
          host: 'imap.gmail.com',
          port: 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false },
          timeout: 90000
        });

        return new Promise((resolve, reject) => {
          imap.once('ready', () => {
            imap.openBox('INBOX', false, (err: any, mailbox: any) => {
              if (err) {
                imap.end();
                reject(err);
              }

              const { total } = mailbox.messages;
              console.log(`Mail count: ${total}`);
              resolve(total);
            });
          });

          imap.once('error', (err: any) => {
            reject(err);
          });

          imap.connect();
        });
      },

      /* -------------------------Files Related tasks---------------------------- */

      // Not used but storing for referring in future since API works without stream for now, it may not in future

      // INSTALL axiom and http first and then use these tasks

      /* During downloading of large data, when we hit GET API and the data is expected to be downloaded in chunks instead of one go, our
         response via cy.request() cannot capture it, We need to handle this data stream in node separately. */
        // getStreamData({ url, headers }) {
        //   return new Promise((resolve, reject) => {
        //     // Make the HTTPS request
        //     const req = https.get(url, { headers, rejectUnauthorized: false}, (res) => {
        //       let data = [];
    
        //       // Handle incoming data chunks
        //       res.on('data', (chunk) => {
        //         data.push(chunk);  // Collect chunks of data
        //       });
    
        //       // When the stream ends, concatenate the chunks and return them
        //       res.on('end', () => {
        //         const fullData = Buffer.concat(data);  // Combine all chunks into one buffer
        //         resolve({
        //           status: res.statusCode,
        //           headers: res.headers,
        //           body: fullData.toString('binary'),  // Convert to binary string if necessary
        //         });
        //       });
        //     });
    
        //     // Handle request error
        //     req.on('error', (err) => {
        //       console.log(err)
        //       reject(err);
        //     });
        //   });
        // },


// getStreamData({ url, headers }) {
//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'get',
//       url: url,
//       headers: headers,
//       responseType: 'arraybuffer', // Get the raw binary data as an ArrayBuffer
//       httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // Ignore SSL errors if necessary
//     })
//       .then((response) => {
//         resolve({
//           status: response.status,
//           headers: response.headers,
//           body: Buffer.from(response.data, 'binary').toString('binary'), // Convert ArrayBuffer to binary string
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error);
//       });
//   });
// },
       /** Write to a file */
       writeFile({ filePath, content }) {
        fs.writeFileSync(filePath, content, 'binary');
        return null;
      },
      
      /**Returns all file names from a location */
      returnFileNames(folderName) {
        return new Promise((resolve, reject) => {
          fs.readdir(folderName, (err, files) => {
            if (err) {
              return reject(err);
            }

            resolve(files);
          });
        });
      },

       /**use regex to return all file names containing that pattern */
       getFilesContainingStringInName([folderName, searchString]) {
        return new Promise((resolve, reject) => {
          fs.readdir(folderName, (err, files) => {
            if (err) {
              return reject(err);
            }

            const filteredFiles = files.filter(fileName => fileName.includes(searchString));
            resolve(filteredFiles);
          });
        });
      },

      /** delete a file  */
      deleteFile(filePath) {
        try {
          fs.unlinkSync(filePath);
          return null; // Return null to indicate success
        } catch (err) {
          return err.message; // Return the error message if deletion fails
        }
      },

      /** extract a zip file and return list of files */
      extractZipFile([filepath, extractpath]) {
        // uses adm-zip library
        // console.log('loading zip', filepath);

        const zip = new AdmZip(filepath);
        const zipEntries = zip.getEntries();
        const allFileNames = zipEntries.map(entry => entry.entryName).sort();

        zip.extractAllTo(extractpath, true);
        return allFileNames;
      },

      /** read file from provided path */
      readPdfFile(filepath) {
        return readPdfFile(filepath);
      },

      /** Validate a pdf of given path, with a string[] of words for validation */
      validatePdfFileWithPath([filename, validationList]) {
        return new Promise((resolve, reject) => {
          readPdfFile(filename)
            .then(info => {
              console.log('INFO', info.text);
              for (const value of validationList) {
                if (!info.text.includes(value)) {
                  reject(new Error(`Validation failed for value: ${value}`));
                }
              }
              resolve(true);
            })
            .catch(error => {
              reject(error);
            });
        });
      },

      /** check if file is present at given path */
      findFile(filePath) {
        return new Promise(resolve => {
          fs.access(filePath, fs.constants.F_OK, err => {
            resolve(!err);
          });
        });
      },

      isFileDownloaded(filePath) {
        return new Promise((resolve, reject) => {
          try {
            if (fs.existsSync(filePath)) {
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (err) {
            reject(err);
          }
        });
      },

      isZipFileDownloaded(downloadPath) {
        return new Promise(resolve => {
          fs.readdir(downloadPath, (err, files) => {
            if (err) {
              throw err;
            }
            const zipFiles = files.filter(file => file.endsWith('.zip'));
            resolve(zipFiles.length > 0);
          });
        });
      },

       /* -------------------------Folder Related tasks---------------------------- */

       /** create folder,- used for downloading files for API case,
       * since download folder is not created */
      createFolder(folderName) {
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName, { recursive: true });
        }
        return null;
      },

         /** delete download folder */
         deleteFolder(folderName) {
          if (fs.existsSync(folderName)) {
            fs.rmdirSync(folderName, { recursive: true });
          }
          return null;
        },

    });
  },

  testTimeout: 200_000,
  taskTimeout: 300000,  // Increase timeout to 5 minutes for CI
  supportFile: 'cypress/support/e2e.ts',
  excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
  chromeWebSecurity: false,
  requestTimeout: 90000,
  responseTimeout: 90000,
  defaultCommandTimeout: 20000,
  pageLoadTimeout: 120000,
  testIsolation: false,
  video: true,
  videoCompression: false, // quality setting for the video compression (0 to 51, lower values give better quality)
  videosFolder: 'cypress/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress/reporter-config.json'
  },
  screenshotsFolder: 'mochawesome-report',
  viewportWidth: 1920,
  viewportHeight: 1080,
  watchForFileChanges: false,
  includeShadowDom: true,
  slowTestThreshold: 180_000,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,
  retries: {
    runMode: 2,
    openMode: 0
  }
};

/**
 * @whereToTest - app type <bx integrated or not> + app environment
 * This takes values from E2E_TEST_LCT_OR_BXLCT + TEST_AGAINST passed at runtime to define the following
 * Spec pattern
 * App URL
 */
switch (whereToTest) {
  case 'LCT_PROD':
    console.log('Inside LCT_PROD. Testing Env is  https://us-lifecycletwin.siemens.com');
    config = {
      e2e: {
        baseUrl: 'https://us-lifecycletwin.siemens.com/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: prod_lct_EnvVars
      }
    };
    break;
  case 'BXLCT_PROD':
    console.log('Inside BXLCT_PROD. Testing Env is  https://us-lifecycletwin.siemens.com');
    config = {
      e2e: {
        baseUrl: 'https://us-lifecycletwin.siemens.com/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: prod_bxlct_EnvVars
      }
    };
    break;
  case 'BXLCT_dev':
    console.log('Inside BXLT_dev. Testing Env is  https://bx.lifecycletwin.horizondev.cloud');
    config = {
      e2e: {
        baseUrl: 'https://bx.lifecycletwin.horizondev.cloud/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: dev_bxlct_EnvVars
      }
    };
    break;
  case 'LCT_dev':
    console.log('Inside NONBXLT_dev. Testing Env is  https://lifecycletwin.horizondev.cloud');
    config = {
      e2e: {
        baseUrl: 'https://lifecycletwin.horizondev.cloud/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: dev_lct_EnvVars
      }
    };
    break;
  case 'BXLCT_prodint':
    console.log('Inside BXLCT_prodint. Testing Env is  https://bx.lifecycletwin.horizonint.cloud');
    config = {
      e2e: {
        baseUrl: 'https://bx.lifecycletwin.horizonint.cloud/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: prodint_bxlct_EnvVars
      }
    };
    break;
  case 'LCT_prodint':
    console.log('Inside LCT_prodint. Testing Env is  https://lifecycletwin.horizonint.cloud');
    config = {
      e2e: {
        baseUrl: 'https://lifecycletwin.horizonint.cloud/',
        specPattern: generateTestSpecPattern(),
        ...commonConfigOptions,
        env: prodint_lct_EnvVars
      }
    };
    break;
  case 'MSI_int':
    console.log('Inside MSI_int. Testing Env is  http://inpun40387wspr.ad001.siemens.net/LifecycleTwin');
    config = {
      e2e: {
        baseUrl: 'http://inpun40387wspr.ad001.siemens.net/LifecycleTwin',

        // Harcode required to run main testcases on MSI / on-premise environment
        specPattern: `cypress/e2e/${folder}/**/LCT_*.spec.{js,jsx,ts,tsx}`,
        ...commonConfigOptions,
        env: dev_msi_EnvVars
      }
    };
    break;
  case 'LCT_BXLCT_dev': // Eco test cases on BXLCT-dev Environment
    console.log('Inside NONBXLT_BXLT_int. Testing Env is  https://bx.lifecycletwin.horizondev.cloud');
    config = {
      e2e: {
        baseUrl: 'https://bx.lifecycletwin.horizondev.cloud/',

        // Harcode required to run main testcases on BX integrated environment
        specPattern: `cypress/e2e/${folder}/**/*LCT_*.spec.{js,jsx,ts,tsx}`,
        ...commonConfigOptions,
        // Value of BXLCT dev env for LCT+BXLCT
        env: dev_bxlct_EnvVars
      }
    };
    break;
  case 'LCT_BXLCT_prodint': // Eco test cases on BXLCT-prodint Environment
    console.log('Inside LCT_BXLCT_prodint. Testing Env is  https://bx.lifecycletwin.horizonint.cloud');
    config = {
      e2e: {
        baseUrl: 'https://bx.lifecycletwin.horizonint.cloud/',

        // Harcode required to run main testcases on BX integrated environment
        specPattern: `cypress/e2e/${folder}/**/*LCT_*.spec.{js,jsx,ts,tsx}`,
        ...commonConfigOptions,
        // Value of BXLCT prodint env for LCT+BXLCT
        env: prodint_bxlct_EnvVars
      }
    };
    break;
  default:
    console.log('Inside Default. Testing Env is https://bx.lifecycletwin.horizondev.cloud');
    config = {
      e2e: {
        baseUrl: 'https://bx.lifecycletwin.horizondev.cloud/',
        specPattern: `cypress/e2e/${folder}`,
        ...commonConfigOptions,
        env: dev_bxlct_EnvVars
      }
    };
}

export default defineConfig(config);

/** method to read pdf file */
export function readPdfFile(filePath) {
  const pdfPath = path.resolve(filePath);
  let dataBuffer = fs.readFileSync(pdfPath);
  return pdf(dataBuffer).then(data => data);
}

// export default defineConfig({
//   e2e: {
//     ...commonConfigOptions,
//     experimentalMemoryManagement: true,
//     numTestsKeptInMemory: 20,
//     experimentalRunAllSpecs: true,
//     supportFile: 'cypress/support/e2e.ts',
//     retries: {
//       runMode: 2,
//       openMode: 2
//     },
//     async setupNodeEvents(on, config) {
//       initPlugin(on, config);
//       const prepareConfig = Promise.resolve(require('./cypress/plugins/index.ts')(on, config));

//       on('after:screenshot', details => {
//         const pathGroups = details.path
//           .replace(/( -- after all hook| -- before all hook| -- before each hook| -- after each hook)/g, '')
//           .match(/(.*mochawesome-report)(.*)/);

//         const filePath = pathGroups[1];

//         const fileNameArray = pathGroups[2].split('--').map(n => n.trim());

//         let newName = fileNameArray
//           .pop()
//           .replace(/[/\\?%*:|"<>]/g, '')
//           .replace(/  +/g, ' ');
//         if (newName.includes('.ts')) newName = newName.split('.ts')[1];
//         const newPath = `${filePath}/${newName}`;

//         return new Promise((resolve, reject) => {
//           require('fs-extra').rename(details.path, newPath, err => {
//             if (err) return reject(err);
//             resolve({ path: newPath });
//           });
//         });
//       });

//       on("task", {
//         getEmails({ email, password }) {
//           const imap = new Imap({
//             user: email,
//             password: password,
//             host: "imap.gmail.com",
//             port: 993,
//             tls: true,
//             tlsOptions: { rejectUnauthorized: false },
//             timeout: 90000,
//           });

//           return new Promise((resolve, reject) => {
//             imap.once("ready", () => {
//               imap.openBox("INBOX", false, (err: any, mailbox: any) => {
//                 if (err) {
//                   imap.end();
//                   reject(err);
//                 }
//                 // Search for the latest received email
//                 // Search for emails
//                 const emails: any = [];
//                 if (mailbox.messages.total == 0) {
//                   imap.end();
//                   resolve(emails);
//                 }
//                 imap.search(["ALL"], (searchErr: any, results: string | any[]) => {
//                   i++;
//                   if (results.length == 0) resolve(emails);
//                   if (searchErr) throw searchErr;
//                   // Fetch email headers and bodies for the latest received email
//                   try {
//                     const fetched = imap.fetch(results, { bodies: "" });
//                     fetched.on(
//                       "message",
//                       (
//                         msg: {
//                           on: (arg0: string, arg1: (stream: any, info: any) => void) => void;
//                           once: (arg0: string, arg1: () => void) => void;
//                         },
//                         seqno: number
//                       ) => {
//                         const emailParts: string[] = [];

//                         msg.on("body", (stream, info) => {
//                           // Accumulate email parts
//                           let buffer = "";

//                           stream.on("data", (chunk: { toString: (arg0: string) => string }) => {
//                             buffer += chunk.toString("utf8");
//                           });

//                           stream.on("end", () => {
//                             const header = Imap.parseHeader(buffer);
//                             emailParts.push(buffer);
//                             emailParts.push(header);
//                           });
//                         });

//                         msg.once("end", () => {
//                           // Parse the email
//                           const emailText = emailParts.join("");
//                           simpleParser(
//                             emailText,
//                             (
//                               parseErr: any,
//                               parsedEmail: {
//                                 subject: any;
//                                 text: any;
//                                 from: { text: any };
//                                 to: { text: any };
//                                 date: { toString: () => any };
//                               }
//                             ) => {
//                               if (parseErr) {
//                                 imap.end();
//                                 reject(parseErr);
//                               }

//                               // Extract the email subject
//                               const subject = parsedEmail.subject;

//                               // Extract the email body
//                               const body = parsedEmail.text;

//                               // Extract the email "From" field
//                               const from = parsedEmail.from.text;

//                               // Extract the email "To" field
//                               const to = parsedEmail.to.text;

//                               // Extract the email "date" field
//                               const date = parsedEmail.date.toString();

//                               // Return the email details
//                               emails.push({ subject, body, from,to, date });

//                               if (seqno == results.length) resolve(emails);
//                             }
//                           );
//                         });
//                       }
//                     );

//                     fetched.on("end", () => {
//                       imap.end();
//                     });
//                   } catch (error) {
//                     console.error(error);
//                     reject(error);
//                   }
//                 });
//               });
//             });

//             imap.connect();
//           });
//         },
//       });

//       on("task", {
//         deleteEmails({ email, password }) {
//           const imap = new Imap({
//             user: email,
//             password: password,
//             host: "imap.gmail.com",
//             port: 993,
//             tls: true,
//             tlsOptions: { rejectUnauthorized: false },
//             timeout: 90000,
//           });
//           let deletedMessagecount = 0;
//           return new Promise((resolve, reject) => {
//             imap.connect();

//             imap.once("ready", () => {
//               imap.openBox("INBOX", false, (err: any, box: any) => {
//                 if (err) throw err;

//                 imap.search(["ALL"], (err: any, messages: any[]) => {
//                   if (err) throw err;
//                   deletedMessagecount = messages.length;
//                   messages.forEach(message => {
//                     imap.addFlags(message, "Deleted", (err: any) => {
//                       if (err) throw err;
//                       console.log(`Message ${message} has been deleted`);
//                     });
//                   });

//                   imap.expunge((err: any) => {
//                     if (err) throw err;
//                     resolve(deletedMessagecount);
//                     console.log("All deleted messages have been permanently removed from the mailbox");
//                     imap.end();
//                   });
//                 });
//               });
//             });

//             imap.once("error", (err: any) => {
//               console.log(err);
//             });
//           });
//         },
//       });

//       on('task', {
//         returnFileNames(folderName) {
//           return new Promise((resolve, reject) => {
//             fs.readdir(folderName, (err, files) => {
//               if (err) {
//                 return reject(err)
//               }

//               resolve(files)
//             })
//           })
//         },
//         getFilesContainingStringInName([folderName, searchString]) {
//           return new Promise((resolve, reject) => {
//             fs.readdir(folderName, (err, files) => {
//               if (err) {
//                 return reject(err)
//               }

//               const filteredFiles = files.filter((fileName) => fileName.includes(searchString));
//               resolve(filteredFiles);
//             });
//           });
//         },
//         deleteFile(filePath) {
//           try {
//             fs.unlinkSync(filePath);
//             return null; // Return null to indicate success
//           }
//           catch (err) {
//             return err.message; // Return the error message if deletion fails
//           }
//         }
//       })

//       on('file:preprocessor', tagify(await prepareConfig));
//       return prepareConfig;
//     }
//   },
//   env: {
//     addScreenshotToReport: true,
//     addRequestResponseToReport: true,
//     addRequestDetailsToReport: true,
//     addCorelationId: true,
//     addErrorStackToReport: true,
//     hideXHRInCommandLog: true
//   }
// });