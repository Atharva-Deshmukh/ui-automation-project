import { login, logout } from "../../support/loginHelper";

describe("Workflow to test login logout using various ways", () => {
  it("login logout using normal helper functions", () => {
    login(
      Cypress.env("TARGET_SITE"),
      Cypress.env("ADMIN_USERNAME"),
      Cypress.env("ADMIN_PASSWORD")
    );
    cy.log(Cypress.env("ADMIN_USERNAME"));
    logout();
  });

  it("login logout using custom commands (parent custom commands) in cypress typescript especially", () => {
    cy.loginTargetSite(Cypress.env("TARGET_SITE"),
    Cypress.env("ADMIN_USERNAME"),
    Cypress.env("ADMIN_PASSWORD"));

    cy.logoutTargetSite();
  });
});
