/// <reference types="cypress" />

/*
  write a clean cypress test suite that covers:
  1. file import page works correctly
  2. quiz page renders correctly from uploaded file
  3. results page renders correctly after submission
  4. different result levels show the correct gif / state

  rules:
  - keep helper logic in functions
  - keep each test focused on one responsibility
  - use clear assertions
  - do not duplicate the full flow in every test unless needed
  - replace TODOs with your code

  strategy array & expected result states in fixtures
    if using json, do not add comments inside the fixture files
    usage either:

    cy.fixture('answerStrategies').then((strategies) => {
    const strategy = strategies.high
    })

    or create helper functions (first two)
*/

// helper functions
function loadSetAnswers() {
    return cy.fixture('setAnswers');
}

function loadExpectedResults() {
    return cy.fixture('expectedResults')
}

function loadQuestions() {
    return cy.fixture('questions.json')
}


function visitHomePage() {
    cy.goToQuizApp();
}

function uploadQuizFile(fileName) {
    cy.uploadQuizFile(fileName);
}

function assertQuizPageLoaded() {

    cy.location('pathname').should('include', 'quiz.html');

    cy.window().then((win) => {
        const quizData = JSON.parse(win.localStorage.getItem('quizData'));
        expect(quizData).to.exist;
    })

}

function assertQuizQuestionsRendered(fileName) {

    loadQuestions().then((data) => {

        const questions = Object.values(data[fileName]);

        cy.get("label").filter(":contains('Q')").then((label) => {
            const count = label.length;
            expect(count).to.equal(questions.length);
        })

        cy.get("label").filter(":contains('Q')").each((label, index) => {
            expect(label.text()).to.include(questions[index].question);

            const qName = "Q" + (index + 1);

            cy.get("input[name=" + qName + "]").then((input) => {

                const inputType = input.attr("type");
                expect(inputType).to.equal(questions[index].type);

                if(inputType == "radio" || inputType == "checkbox") {
                    cy.get("label[for=" + qName + "]").each((lab, ind) => {
                        expect(lab.text()).to.include(questions[index].answers[ind]);
                    });
                }
 
            })
        })

    });

    expect(cy.get("input[type='submit']")).to.exist;
    cy.get("input[type='submit']").invoke("val").then((val) => {
        expect(val).to.equal("Submit");
    });

}

function answerTextQuestion(qName, value) {
  cy.get("input[name=" + qName + "]").type(value, { delay: 200 });
}

function answerRadioQuestions(qName, value) {
   cy.get("input[name=" + qName + "][value=" + value + "]").check();
}

function answerCheckboxQuestions(qName, values) {
  values.forEach((value) => {
    cy.get(`input[name="${qName}"][value="${value}"]`).check();
  })
}

function submitQuiz() {
  cy.get('input[type="submit"]').click();
}

function answerQuestions(fileName) {
  
    loadSetAnswers().then((data) => {

        const answers = Object.values(data[fileName]);

        cy.get("label").filter(":contains('Q')").each((label, index) => {

            const qName = "Q" + (index + 1);

            cy.get("input[name=" + qName + "]").then((input) => {

              const type = input.attr("type");

              switch (type)
              {

                case "radio":
                  answerRadioQuestions(qName, answers[index].value);
                  break;
                
                case "checkbox":
                  answerCheckboxQuestions(qName, answers[index].value);
                  break;

                default:
                  answerTextQuestion(qName, answers[index].value);

              }
            
            })

        })

    })

}

function assertResultsPageLoaded(testName) {

    cy.location('pathname').should('include', 'results.html');

    loadExpectedResults().then((data) => {

      const results = Object.values(data[testName]);

      const resScores = Object.values(data[testName].scores);
      const resGif = data[testName].gif;

      assertScoreIsDisplayed(resScores);
      assertResultGif(resGif);

      cy.get("h2").each((h2, index) => {
        
        assertUserAnswersDisplayed(index, results[index].UA);
        assertCorrectAnswersDisplayed(index, results[index].CA);

      })

    })

}

function assertScoreIsDisplayed(scores) {
  cy.get("#resultScore").should("contain", scores[0]);
  cy.get("#resultScore").should("contain", scores[1]);
}

function assertUserAnswersDisplayed(count, data) {
  cy.get("#UA" + count).then((p) => {
    const text = p.text();
    data.forEach((d) => {
      expect(text).to.include(d);
    })
  })
}

function assertCorrectAnswersDisplayed(count, data) {
  cy.get("#CA" + count).then((p) => {
    const text = p.text();
    data.forEach((d) => {
      expect(text).to.include(d);
    })
  })
}

function assertResultGif(gifName) {
  cy.get("#resultGif").should("be.visible");
  cy.get("#resultGif").should("have.prop", "naturalWidth").and("be.greaterThan", 0);
  cy.get("#resultGif").should("have.attr", "src").and("include", gifName);
}

// test suite
describe('quiz app', () => {
  it('imports a quiz file and opens the quiz page', () => {
    visitHomePage();
    uploadQuizFile('Test.txt');
    assertQuizPageLoaded();
  });

  it('renders quiz questions and input types correctly', () => {
    visitHomePage();
    uploadQuizFile('Test.txt');
    assertQuizPageLoaded();
    assertQuizQuestionsRendered("Test");
  });

  it('submits a completed quiz and shows the results page', () => {
    visitHomePage();
    uploadQuizFile('Test.txt');
    assertQuizPageLoaded("Test");

    answerQuestions("Test");
    submitQuiz();

    assertResultsPageLoaded("Test");
  });

  const files = ['Test.txt', 'Test2.txt', "Test3.txt"];

  files.forEach((fileName) => {
    it("Full file test: " + fileName, () => {
      const name = fileName.replace(/\.txt$/, "");

      visitHomePage();
      uploadQuizFile(fileName);
      assertQuizPageLoaded(name);

      answerQuestions(name);
      submitQuiz();

      assertResultsPageLoaded(name);
    })
  })

});
