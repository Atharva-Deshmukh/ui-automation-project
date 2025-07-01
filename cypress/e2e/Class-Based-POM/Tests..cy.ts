import { LoginPage } from './Pages';
import { loginTestData } from './loginTestData';

const loginPageObject = new LoginPage();

describe('Login Workflow', () => {

    it('should log in successfully', () => {
        loginPageObject.visit(loginTestData.url);
        loginPageObject.typeUsername(loginTestData.username);
        loginPageObject.typePassword(loginTestData.password);
        loginPageObject.clickLoginButton();
    });

});