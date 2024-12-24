# Using Cypress Tool (Fully Configured in TypeScript)

![Cypress Logo](https://www.cypress.io/img/logo.png)
![TypeScript Logo](https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png)

This project utilizes Cypress, which has been fully configured in **TypeScript**.

---

## How Cypress Was Set Up Fully in TypeScript in This Repo:

1. **Create `package.json`**:
   - Use `yarn init` and configure it.

2. **Install dependencies**:
   - Install Cypress and TypeScript along with other **node modules** using:  
     `yarn add -D cypress typescript`.

3. **Set up TypeScript**:
   - Create a `tsconfig.json` file and copy the content from Cypress's documentation.

4. **Initialize Cypress**:
   - Run `yarn cypress open --e2e` to start Cypress.  
   - All built-in configurations will appear with `.ts` extensions.  
   - Click on **Continue**, and configuration files with `.ts` extensions will be added inside the `cypress` folder.

5. **Downloads folder**:
   - A downloads folder is not created by default. It will be generated only when a file is downloaded.

6. **Run Cypress**:
   - Use the command: `yarn run cypress open`.

7. **E2E Configuration**:
   - Initially, Cypress will not be configured.  
     Click on **E2E**, and all files like `e2e`, `examples`, etc., will be set up under the `cypress` folder.  
   - No specs will exist initially. Click on **Scaffold Specs** to automatically create pre-written specs under `e2e`.

8. **Create `cypress.env.json`**:
   - Use `touch cypress.env.json` to create a `cypress.env.json` file to utilize `Cypress.env()`.

9. **Modify `package.json`**:
   - Update the **scripts** section to open Cypress for specific folders in CI/CD headless mode.  
     - Ensure no spaces exist inside `scripts {}` in `package.json`.
     - Use `yarn run` before any keys inside `scripts`.

10. **Use Cypress commands directly**:
    - It's better to use Cypress commands directly instead of relying on script shortcuts. This helps in memorizing commands through frequent use.

---

## Adding `WaitUntil`

1. Install the package:  
   `yarn add --dev cypress-wait-until`.

2. Add the following import in `commands.ts`:  
   `import 'cypress-wait-until';`.

3. Correct usage format:  
   `cy.waitUntil(() => someLocator, commonTimeout);`.

---

## Adding Custom Commands

1. File structure changes:  
   - In the UI, `index.js` becomes `e2e.ts`.  
   - However, in `cypress > .bin` inside `node_modules`, it remains `index.js`.

2. Adding commands in TypeScript:  
   - Write custom commands inside `commands.ts` and declare their namespace there.  
   - Import the `commands.ts` file inside `e2e.ts`.

---

## Set Up a Single Session Storage

By default, Cypress automatically clears local storage, session storage, and cookies between each test (`it` block).  
This behavior ensures a clean and isolated environment for each test.

### Ways to Manage Session Storage:
- Use `{ testIsolation: false }` inside `describe` or in `cypress.config.ts` to make all test cases non-independent.
- Manually create a single session and then clear it as needed.

---

## Git Commands Used

1. **Delete an existing remote**:  
   `git remote rm origin`.

2. **Add a remote**:  
   `git remote add origin LOGIN_URL`.

3. **Handle `node_modules` and `.gitignore` issues**:  
   - If `.gitignore` is created after pushing `node_modules`, clear the Git cache:  
     `git rm -r --cached node_modules`.

4. **Merge branches with no common ancestors**:  
   `git merge --allow-unrelated-histories origin/master`.

5. **Delete a remote branch**:  
   `git push origin --delete branch_name`.

---

## Regarding SSH Key

1. Generate an SSH key:  
   `ssh-keygen -t ed25519` (run in the command prompt).

2. Placement:  
   - The SSH key should reside in `users/.ssh` when pushing code.  
   - This same key can be reused across other repositories on GitLab and GitHub.

---
