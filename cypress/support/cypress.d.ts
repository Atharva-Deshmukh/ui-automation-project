// cypress/support/cypress.d.ts

/// <reference types="cypress" />
import 'cypress-plugin-snapshots/commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Snapshot testing for DOM element.
       * Can be called on Cypress elements like cy.get(), cy.document(), etc.
       */
      toMatchImageSnapshot(options?: Partial<SnapshotOptions>): Chainable<void>;
    }
  }

  interface SnapshotOptions {
    blackout?: string[];
    capture?: 'fullPage' | 'viewport' | 'runner';
    clip?: Cypress.Rectangle;
    disableTimersAndAnimations?: boolean;
    log?: boolean;
    scale?: boolean;
    timeout?: number;
  }
}

export {};
