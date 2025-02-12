import * as doc from "pdfkit";
import { uiTimeout } from "../fixtures/commonData";

Cypress.Commands.add('getByName', (name) => {
    return cy.get(`[name="${name}"]`, {timeout: uiTimeout});
});

Cypress.Commands.add('Console', {prevSubject: ['element', 'document', 'window']}, (subject) => {
    console.log('CHILD COMMAND LOG SUBJECT -> ', subject);
});

Cypress.Commands.add('hybridConsole', {prevSubject: ['optional', 'element', 'document', 'window']}, (subject) => {
    if(subject) console.log('DUAL COMMAND LOG SUBJECT -> ', subject);
    else console.log('NO SUBJECT');
});

// these parameters are autosuggested by VS CODE, since we already have type(),
// but hat is sometimes correct, here, in this case, element parameter was not suggested 
Cypress.Commands.overwrite('type', (originalFn, element, text, options = {}) => {
    if(options && options.sensitive === true) {
        Cypress.log({message: '*'.repeat(text.length)});
    }

    return originalFn(element, text, options);
});