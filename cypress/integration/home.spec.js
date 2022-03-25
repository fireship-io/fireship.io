/// <reference types="cypress" />

describe('Fireship Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1313')
  })

  it('displays a title', () => {
   
    cy.get('.topnav-links').should('contain.text', "Courses")

  })
})
