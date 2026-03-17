import 'cypress-file-upload';

Cypress.Commands.add('uploadQuizFile', (fileName) => {
  cy.get('input[type="file"]').attachFile(fileName);
});

Cypress.Commands.add('goToQuizApp', () => {
  cy.visit('../../../src/index.html');
});