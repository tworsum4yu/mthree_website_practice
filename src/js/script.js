// Index page
const quiz = document.getElementById('quiz');

if (quiz) {
  document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const quizData = parseQuiz(reader.result);
      localStorage.setItem('quizData', JSON.stringify(quizData));
      renderQuiz(quizData);
    };
    reader.readAsText(file);
  });

  // Do check to ensure that this works properly
  function parseQuiz(text) {
    const blocks = text.trim().split('\r\n\r\n');
    console.log(blocks);
    return blocks.map((block) => {
      const lines = block.split('\r\n');
      const question = lines.find((l) => l.startsWith('Q:')).slice(3);
      const answers = lines.filter((l) => l.startsWith('A:')).map((a) => a.slice(3));
      const correct = lines.filter((l) => l.startsWith('C:')).map((c) => c.slice(3));
      return { question, answers, correct };
    });
  }

  function renderQuiz(quizData) {
    const quizForm = document.getElementById('quizForm');
    quizForm.innerHTML = '';

    quizData.forEach((q, index) => {
      const count = index + 1;

      const label = document.createElement('label');

      label.textContent = 'Q' + count + ': ' + q.question;

      quizForm.appendChild(label);

      if (q.answers.length > 0) {
        let type = '';

        if (q.correct.length > 1) {
          type = 'checkbox';
        } else {
          type = 'radio';
        }

        q.answers.forEach((a) => {
          const input = document.createElement('input');
          const inputLabel = document.createElement('label');

          input.type = type;
          input.value = a;
          input.name = 'Q' + count;

          inputLabel.textContent = a;
          inputLabel.htmlFor = 'Q' + count;

          quizForm.appendChild(input);
          quizForm.appendChild(inputLabel);
        });
      } else {
        const input = document.createElement('input');

        input.type = 'text';
        input.name = 'Q' + count;
        input.value = '';

        quizForm.appendChild(input);
      }

      quizForm.appendChild(document.createElement('br'));
      quizForm.appendChild(document.createElement('br'));
    });

    const submit = document.createElement('input');

    submit.type = 'submit';
    submit.value = 'Submit';

    quizForm.appendChild(submit);
  }

  quiz.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem('quizData'));

    let score = 0;

    data.forEach((q, index) => {
      const count = index + 1;
      const qName = 'Q' + count;

      if (q.answers.length > 0) {
        if (q.correct.length > 1) {
          const userAnswer = [
            ...e.target.querySelectorAll("input[name='" + qName + "']:checked"),
          ].map((a) => a.value);
          const sameLength = userAnswer.length == q.correct.length;
          const sameValues = userAnswer.every((a) => q.correct.includes(a));

          if (sameLength && sameValues) score++;
        } else {
          const userAnswer = e.target.querySelector("input[name='" + qName + "']:checked");

          if (q.correct.includes(userAnswer.value)) score++;
        }
      } else {
        const userAnswer = e.target.elements[qName].value.trim().toLowerCase();
        const correct = q.correct.map((c) => c.toLowerCase());

        if (correct.includes(userAnswer)) score++;
      }
    });

    localStorage.setItem('score', score);

    window.location.href = 'pages/results.html';
  });
}

// Results page
const data = JSON.parse(localStorage.getItem('quizData'));
const score = Number(localStorage.getItem('score'));

const gif = document.getElementById('resultGif');
const scoreMess = document.getElementById('resultScore');

if (gif && scoreMess) {
  scoreMess.textContent = 'You scored ' + score + " out of " + data.length;

  if (score / data.length < 0.5) {
    gif.src = '../assets/sad.gif';
  } else if (score / data.length < 0.75) {
    gif.src = '../assets/edp.gif';
  } else {
    gif.src = '../assets/rad.gif';
  }
}
