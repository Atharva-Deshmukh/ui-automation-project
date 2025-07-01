export class LoginPage {
    
    loginLocators = {
        'username': 'username',
        'password': 'password', // name
        'loginButton': 'submit' // type
    }

    visit(url: string) {
        cy.visit(url);
    }

    typeUsername(username: string) {
        cy.get(`[name="${this.loginLocators.username}"]`).type(username);
    }

    typePassword(password: string) {
        cy.get(`[name="${this.loginLocators.password}"]`).type(password);
    }

    clickLoginButton() {
        cy.get(`[type="${this.loginLocators.loginButton}"]`).click();
    }
};