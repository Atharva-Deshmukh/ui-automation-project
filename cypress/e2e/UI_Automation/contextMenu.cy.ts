import { uiTimeout } from "../../fixtures/commonData"


it('ContextMenu Opens on right click', () => {
    cy.visit('https://www.softwaretestingmentor.com/automation-practice-page-right-click-demo/', {timeout: uiTimeout});

    cy.contains('Right Click to see the menu', {timeout: uiTimeout})
    .should('be.visible')
    .rightclick()
    .then(() => {
        cy.scrollTo('top')
        cy.get('.menuItems', {timeout: uiTimeout})
        .should('be.visible')
        .then(($ele) => {
            cy.wrap($ele).find('li a[rel="noopener"]').each(($menu, index) => {
                cy.log(`MENU ${index + 1} ->  `+ $menu.text());
            });
        });
    });
});

it('ContextMenu Opens on hovering', () => {
    cy.visit('https://swisnl.github.io/jQuery-contextMenu/demo/trigger-hover-autohide.html');

    cy.contains('hover over me', {timeout: uiTimeout})
    .should('be.visible')
    .realHover()
    .then(() => {
        cy.get('.context-menu-list.context-menu-root', {timeout: uiTimeout})
        .should('be.visible')
        .then(($ele) => {
            cy.wrap($ele).find('li span').each(($menu, index) => {
                cy.log(`MENU ${index + 1} ->  `+ $menu.text());
            });
        });
    });
});