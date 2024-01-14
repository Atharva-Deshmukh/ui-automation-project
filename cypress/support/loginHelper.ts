import { commonTimeOut } from "../fixtures/commonData";
import * as uiHelper from "../fixtures/uiHelper";

export const logo = () => cy.get(".orangehrm-login-logo").should("be.visible");
export const usernameInput = () =>
  cy.get('.oxd-form input[name="username"]').should("be.visible");
export const passwordInput = () =>
  cy.get('.oxd-form input[name="password"]').should("be.visible");
export const loginButton = () =>
  cy.get('.oxd-form button:contains("Login")').should("be.visible");
export const attendanceCanvas = () =>
  cy.get(".emp-attendance-chart canvas").should("be.visible");
export const userDropdownIcon = () =>
  cy.get(".oxd-userdropdown-icon").should("be.visible");
export const userDropdownMenu = (menuName: string) =>
  cy.get(`.oxd-dropdown-menu a:contains(${menuName})`).should("be.visible");

export function login(targetSite: string, username: string, password: string) {
  cy.visit(targetSite);
  cy.waitUntil(() => logo(), commonTimeOut);
  usernameInput().type(username);
  passwordInput().type(password);
  loginButton().click();
  cy.waitUntil(() => attendanceCanvas(), commonTimeOut);
  uiHelper.verifyLoadingSymbol();
}

export function logout() {
  userDropdownIcon().click();
  userDropdownMenu("Logout").click();
  cy.waitUntil(() => logo(), commonTimeOut);
  uiHelper.verifyLoadingSymbol();
}
