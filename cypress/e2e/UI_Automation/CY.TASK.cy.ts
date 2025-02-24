/* Execute code in Node via the task plugin event.

Syntax
    cy.task(event)
    cy.task(event, arg)
    cy.task(event, arg, options)

// in test
cy.task('log', 'This will be output to the terminal')


import { defineConfig } from 'cypress'
export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)

          return null
        },
      })
    },
  },
})

If you need to pass multiple arguments, use an object
cy.task('hello', { greeting: 'Hello', name: 'World' })

An argument to send along with the event. This can be any value that can be serialized by JSON.stringify(). 
Unserializable types such as functions, regular expressions, or symbols will be omitted to null.

Tasks must end: Tasks that do not end are not supported
cy.task() does not support tasks that do not end, such as:
    Starting a server.
    A task that watches for file changes.
    Any process that needs to be manually interrupted to stop.
    A task must end within the taskTimeout or Cypress will fail the current test.

----------------------------------------WAYS TO DEFINE:-------------------------------------------

WAY-1:

 e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        'defaults:db': () => {
          return db.seed('defaults')
        },
      })
    },
  },

WAY-2: Like I have defined in config.ts

setupNodeEvents(on, config) {

      on('task', {
        noParam: noParam,
      });

                                            // Function definitions
      function noParam() {
        return 'No Param';
      }

}
*/

describe('WORKFLOWS', () => {
    it('Different functions', () => {
        cy.task('noParam').then((resp) => {
            expect(resp).to.equal('No Param');
        });

        cy.task('singleParam', 'SINGLE INPUT').then((resp) => {
            expect(resp).to.equal('SINGLE INPUT');
        });

        cy.task('singleParam', {inputKey: 'SINGLE INPUT'}).then((resp) => {
            expect(resp).to.deep.equal({inputKey: 'SINGLE INPUT'});
        });

        cy.task('multipleParams', {Name: 'AD', Age: 24}).then((resp) => {
            expect(resp).to.equal('AD 24');
        });
    }); 

    it('Read Excel sheet', () => {
        cy.task('readExcel', {filePath: 'C:/Users/Acer/Desktop', sheetName: 'Sheet1' , returnType: 'column', columnName: 'SR.NO'}).then((resp) => {
            console.warn('RESP -> ', resp)
        });
    }); 
});