/// <reference types="cypress" />

const baseUrl = 'http://localhost:1313';

describe('fireship.io', () => {
  it('loads', () => {
    cy.visit(baseUrl);
    cy.wait(1000); // wait for web components & firebase

    cy.contains('Build and ship 🔥 your app ⚡ faster');
  });

  it('has a working Algolia search', () => {
      cy.get('.sidenav').find('algolia-button').first().click();
      const search = cy.get('.algolia-search');
      search.should('be.visible');

      cy.get('.algolia-input').type('fire ');
      cy.contains('@angular/fire');
      cy.contains('close').click();
  });

  it('swaps out themes', () => {
    cy.get('body').should('have.class', 'dark-theme');

    cy.get('theme-btn').click();
    cy.get('body').should('have.class', 'light-theme');

    cy.get('theme-btn').click();
    cy.get('body').should('have.class', 'colorful-theme');

    cy.get('theme-btn').click();
  });

  it('has a working mega menu', () => {
    cy.get('.mega-menu').should('not.be.visible');
    cy.get('menu-toggler').click();
    cy.get('.mega-menu').should('be.visible');
  });

  it('should navigate', () => {
    cy.get('a[href="/lessons"]').first().click();
    cy.url().should('contain', 'lessons');

    cy.visit(`${baseUrl}/tags`);

    cy.get('.tag').contains('#firebase').last().click();
    cy.url().should('contain', 'tags/firebase');

    cy.get('.item.logo').click();
    cy.url().should('not.contain', 'tags/firebase');
  });
});
