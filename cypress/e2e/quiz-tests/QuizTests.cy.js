/// <reference types="cypress" />

// 3 Tests
// 1. Make sure file import page working as intended
// 2. Make sure quiz generation page working as intended
// 3. Make sure results page rendering as intended

const baseUrl = '../../../src/';

context('QuizTest', () => {
  it('End To End Test 1', () => {
    cy.visit(baseUrl + 'index.html');

    cy.get('input[type="file"]').attachFile({
      filePath: 'Test.txt',
    });

    cy.location('pathname').should('include', 'quiz.html');

    cy.get('#quizForm label')
      .filter((i, el) => el.textContent.startsWith('Q'))
      .each(($label, index) => {
        const qName = `Q` + (index + 1);

        cy.get(`input[name="${qName}"]`).then(($inputs) => {
          if ($inputs.first().attr('type') === 'text') {
            cy.get(`input[name="${qName}"]`).type('Hello World', { delay: 200 });
          } else if ($inputs.first().attr('type') === 'radio') {
            cy.get(`input[name="${qName}"]`).first().check();
          } else if ($inputs.first().attr('type') === 'checkbox') {
            cy.get(`input[name="${qName}"]`).first().check({ delay: 200 });
          }
        });
      });

    cy.get('input[type="submit"]').click();

    cy.location('pathname').should('include', 'results.html');

    const testScore = 0;

    cy.window()
      .then((win) => {
        const quizData = JSON.parse(win.localStorage.getItem('quizData'));
        const score = Number(win.localStorage.getItem('score'));

        const userAnswers = JSON.parse(win.localStorage.getItem('answers'));

        expect(quizData).to.exist;
        expect(score).to.exist;
        expect(userAnswers).to.exist;

        return { quizData, score, userAnswers };
      })
      .then(({ quizData, score, userAnswers }) => {
        cy.get('#resultScore').should('contain', score);
        cy.get('#resultScore').should('contain', quizData.length);

        quizData.forEach((q, index) => {
          cy.get('#UA' + index).should('contain', userAnswers[index]);
          cy.get('#CA' + index).should('contain', q.correct);
        });
      });
  });

  it('End To End Test 2', () => {
    cy.visit(baseUrl + 'index.html');

    cy.get('input[type="file"]').attachFile({
      filePath: 'Test2.txt',
    });

    cy.location('pathname').should('include', 'quiz.html');

    cy.get('#quizForm label')
      .filter((i, el) => el.textContent.startsWith('Q'))
      .each(($label, index) => {
        const qName = `Q` + (index + 1);

        cy.get(`input[name="${qName}"]`).then(($inputs) => {
          if ($inputs.first().attr('type') === 'text') {
            cy.get(`input[name="${qName}"]`).type('Theon', { delay: 200 });
          } else if ($inputs.first().attr('type') === 'radio') {
            cy.get(`input[name="${qName}"]`).first().check();
          } else if ($inputs.first().attr('type') === 'checkbox') {
            cy.get(`input[name="${qName}"]`).first().check({ delay: 200 });
          }
        });
      });

    cy.get('input[type="submit"]').click();

    cy.location('pathname').should('include', 'results.html');

    const testScore = 0;

    cy.window()
      .then((win) => {
        const quizData = JSON.parse(win.localStorage.getItem('quizData'));
        const score = Number(win.localStorage.getItem('score'));

        const userAnswers = JSON.parse(win.localStorage.getItem('answers'));

        expect(quizData).to.exist;
        expect(score).to.exist;
        expect(userAnswers).to.exist;

        return { quizData, score, userAnswers };
      })
      .then(({ quizData, score, userAnswers }) => {
        cy.get('#resultScore').should('contain', score);
        cy.get('#resultScore').should('contain', quizData.length);

        quizData.forEach((q, index) => {
          cy.get('#UA' + index).should('contain', userAnswers[index]);
          cy.get('#CA' + index).should('contain', q.correct);
        });
      });
  });

  it('End To End Test 3', () => {
    cy.visit(baseUrl + 'index.html');

    cy.get('input[type="file"]').attachFile({
      filePath: 'Test3.txt',
    });

    cy.location('pathname').should('include', 'quiz.html');

    cy.get('#quizForm label')
      .filter((i, el) => el.textContent.startsWith('Q'))
      .each(($label, index) => {
        const qName = `Q` + (index + 1);

        cy.get(`input[name="${qName}"]`).then(($inputs) => {
          if ($inputs.first().attr('type') === 'text') {
            cy.get(`input[name="${qName}"]`).type('Theon', { delay: 200 });
          } else if ($inputs.first().attr('type') === 'radio') {
            cy.get(`input[name="${qName}"]`).first().check();
          } else if ($inputs.first().attr('type') === 'checkbox') {
            cy.get(`input[name="${qName}"]`).first().check({ delay: 200 });
          }
        });
      });

    cy.get('input[type="submit"]').click();

    cy.location('pathname').should('include', 'results.html');

    const testScore = 0;

    cy.window()
      .then((win) => {
        const quizData = JSON.parse(win.localStorage.getItem('quizData'));
        const score = Number(win.localStorage.getItem('score'));

        const userAnswers = JSON.parse(win.localStorage.getItem('answers'));

        expect(quizData).to.exist;
        expect(score).to.exist;
        expect(userAnswers).to.exist;

        return { quizData, score, userAnswers };
      })
      .then(({ quizData, score, userAnswers }) => {
        cy.get('#resultScore').should('contain', score);
        cy.get('#resultScore').should('contain', quizData.length);

        quizData.forEach((q, index) => {
          cy.get('#UA' + index).should('contain', userAnswers[index]);
          cy.get('#CA' + index).should('contain', q.correct);
        });
      });
  });
});
