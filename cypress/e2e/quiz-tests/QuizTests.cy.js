/// <reference types="cypress" />

// 3 Tests
// 1. Make sure file import page working as intended
// 2. Make sure quiz generation page working as intended
// 3. Make sure results page rendering as intended

const baseUrl = '../../../src/';

function parseQuiz(text) {
  let normalised = text.trim();

  if (text.includes('\r\n')) {
    normalised = text.replace(/\r\n/g, '\n').trim();
  } else if (text.includes('\r')) {
    normalised = text.replace(/\r/g, '\n').trim();
  }
  // const blocks = text.trim().split('\r\n\r\n');
  const blocks = normalised.split('\n\n');
  return blocks.map((block) => {
    const lines = block.split('\n');
    const question = lines.find((l) => l.startsWith('Q:')).slice(3);
    const answers = lines.filter((l) => l.startsWith('A:')).map((a) => a.slice(3));
    const correct = lines.filter((l) => l.startsWith('C:')).map((c) => c.slice(3));
    return { question, answers, correct };
  });
}

describe('QuizTest', () => {

  const expected = [
    {
      file: "Test.txt",
      Q1_type: "radio",
      Q2_type: "radio",
      Q3_type: "text"
    },
    {
      file: "Test2.txt",
      Q1_type: "text",
    },
    {
      file: "Test3.txt",
      Q1_type: "radio",
      Q2_type: "radio",
      Q3_type: "text",
      Q4_type: "checkbox"
    }
  ]

  context('File Import Checks', () => {
    it('File Import Page Render Test', () => {
      cy.visit(baseUrl + 'index.html');

      cy.get('h1').should('contain', "File Import");
      cy.get('label').first().should('contain', "Please select the file to import below");

      cy.get('label.file-upload').should('contain', "Select Quiz File");
      cy.get('label.file-upload').should('have.css', "background-color", "rgb(74, 108, 247)");

    });

    it('File Import Attachment Test', () => {

      cy.visit(baseUrl + 'index.html');

      expected.forEach((tests) => {

        cy.log("=====================================");
        cy.log("File Import check for " + tests.file);
        cy.log("=====================================");

        cy.get('input[type="file"]').attachFile({
          filePath: tests.file,
        });

        cy.location('pathname').should('include', 'quiz.html');

        cy.window().then((win) => {
          const quizData = JSON.parse(win.localStorage.getItem('quizData'));
          expect(quizData).to.exist;
        })

        cy.fixture(tests.file).then((content) => {
          
          const parsedQuiz = parseQuiz(content);

          parsedQuiz.forEach((q, index) => {
            const count = index + 1;

            cy.log(q.question);

            cy.get("label").filter(":contains('Q')").eq(index).should('contain.text', q.question);
          })

        })

        cy.visit(baseUrl + 'index.html');

      })

    });

  });

});

// context('QuizTest', () => {
//   it('End To End Test 1', () => {
//     cy.visit(baseUrl + 'index.html');



//     cy.get('input[type="file"]').attachFile({
//       filePath: 'Test.txt',
//     });

//     cy.location('pathname').should('include', 'quiz.html');

//     cy.get('#quizForm label')
//       .filter((i, el) => el.textContent.startsWith('Q'))
//       .each(($label, index) => {
//         const qName = `Q` + (index + 1);

//         cy.get(`input[name="${qName}"]`).then(($inputs) => {
//           if ($inputs.first().attr('type') === 'text') {
//             cy.get(`input[name="${qName}"]`).type('Hello World', { delay: 200 });
//           } else if ($inputs.first().attr('type') === 'radio') {
//             cy.get(`input[name="${qName}"]`).first().check();
//           } else if ($inputs.first().attr('type') === 'checkbox') {
//             cy.get(`input[name="${qName}"]`).first().check({ delay: 200 });
//           }
//         });
//       });

//     cy.get('input[type="submit"]').click();

//     cy.location('pathname').should('include', 'results.html');

//     const testScore = 0;

//     cy.window()
//       .then((win) => {
//         const quizData = JSON.parse(win.localStorage.getItem('quizData'));
//         const score = Number(win.localStorage.getItem('score'));

//         const userAnswers = JSON.parse(win.localStorage.getItem('answers'));

//         expect(quizData).to.exist;
//         expect(score).to.exist;
//         expect(userAnswers).to.exist;

//         return { quizData, score, userAnswers };
//       })
//       .then(({ quizData, score, userAnswers }) => {
//         cy.get('#resultScore').should('contain', score);
//         cy.get('#resultScore').should('contain', quizData.length);

//         quizData.forEach((q, index) => {
//           cy.get('#UA' + index).should('contain', userAnswers[index]);
//           cy.get('#CA' + index).should('contain', q.correct);
//         });
//       });
//   });
// });
