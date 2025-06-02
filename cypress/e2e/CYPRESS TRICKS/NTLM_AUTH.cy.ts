/* This NTLM windows auth is used only for INTRANET applications (internal users)

We can host our applications in windows' IIS (Internet Information Server) manager
Just right click on sites >> click on add site and enter site URL and other details.

IIS is not installed by default in windows OS, u need to install it separately.

Under sites >> ur site >> click on it >> various option opens >> Authentication option is there

By default, anonymous authentication is enabled, This is pretty useless, like Allow '*' type
Cypress can enter it easily.

Enable Windows Auth now (after disabling anonymous authentication).
Now, whenever we visit our site, we will get a prompt, needing our username and password.

Plugin used: cypress-ntlm-auth

Command u get here = cy.ntml([localHost URL], username, password)

                                                ANOTHER CHANGE:
                                                -------------

The most convenient way to start Cypress with NTLM authentication is

npx cypress-ntlm open

This starts the ntlm-proxy and runs cypress in headed mode (like cypress open). 
After Cypress exits, the ntlm-proxy is terminated. cypress-ntlm open accepts the same command 
line arguments that cypress open does.

npx cypress-ntlm run
This starts the ntlm-proxy and runs cypress in headless mode (like cypress run), suitable for CI. 
After Cypress exits, the ntlm-proxy is terminated.cypress-ntlm run accepts the same command line 
arguments that cypress run does.





 */