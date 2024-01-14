Using Cypress tool. Cypress is fully configured in typescript

_________________________________________________
HOW CYPRESS WAS SET UP FULLY IN TYPESCRIPT IN THIS REPO:
_________________________________________________
> Create **package.json** using **yarn init** and configure it

> Install **node modules** and cypress + typescript at a time  using **yarn add -D cypress typescript**

> create a **tsconfig.json** file and copy the content from cypress.io

> Till now cypress is not configured although installed.

> run **yarn cypress open --e2e**  and you will see all cypress built in configurations in .ts extensions only.

> click on continue and all configuration files with .ts extension will be added inside cypress folder

> There is no downloads folder by default anywhere, it will be created when something will be downloaded 

> Command to run cypress: **yarn run cypress open**

> Cypress will not be configured initially, click on e2e and all the files like e2e, examples, etc will be set up under cypress folder

> There are no specs initially hence click on scaffold specs options, e2e is created automatically with pre written specs

> **touch cypress.env.json** to create an **cypress.env.json** file to use Cypress.env()

> make changes in **package.json** >>**scripts** files to open cypress for specific folders in CI/CD headless mode.

> Note that spaces are not allowed inside scripts {} in package.json

> use **yarn run** before any keys inside scripts

> its better to directly use cypress commands instead of ones in script in order to memorise them by frequent uses

_________________________________________________
ADDING WaitUntil()
_________________________________________________
**yarn add --dev cypress-wait-until**
add **import 'cypress-wait-until';** in commands.ts

format of this function must be correct while using it.
cy.waitUntil(() => someLocator, commonTimeout);

_________________________________________________
ADDING CUSTOM COMMANDS:
_________________________________________________
index.js has become e2e.ts in the UI but in cypress > .bin in node_modules its index.js only

its easy to add them in javascript since inside e2e.js, commands.js is already there.
But to add the custom commands in typescript is challenging one. Hence I had reconfigured this project in fully typescript mode.

_________________________________________________
GIT COMMANDS USED:
_________________________________________________
> to delete an existing remote: **git remote rm origin**
> to add remote: **git remote add origin LOGIN_URL**
> usually gitignore prevents tracking node modules but I created gitIgnore after pushing node modules, hence I must clear git cache using **git rm -r --cached node_modules**

_________________________________________________
REGARDING SSH KEY
_________________________________________________
> **ssh-keygen -t ed25519** inside command prompt to generate ssh key

> ssh key should be inside users/.ssh ONLY while pushing the code. THIS same ssh keys can be added to other repositories on gitlab and github as well and this key is REUSED.