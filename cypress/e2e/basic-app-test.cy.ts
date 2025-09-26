describe('HabitForge Basic App Test', () => {
  it('should load the homepage', () => {
    cy.visit('/');
    cy.contains('Transform Your Life').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.visit('/login');
    cy.contains('Welcome Back').should('be.visible');
  });

  it('should navigate to signup page', () => {
    cy.visit('/signup');
    cy.contains('Create Your Account').should('be.visible');
  });
});