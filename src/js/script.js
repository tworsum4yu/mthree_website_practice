// Index page
const quiz = document.getElementById("quiz");

if(quiz) {
  quiz.addEventListener('submit', function (e) {
    e.preventDefault();

    const correct = {
      Q1: 'saiga antelope',
      Q2: 'FALSE',
      Q3: 'W_G',
      Q4: 'green',
    };

    let score = 0;

    const A1 = this.elements['Q1'].value.trim().toLowerCase();
    if (A1 == correct.Q1.toLowerCase()) score++;

    const A2 = this.querySelector('input[name="Q2"]:checked');
    if (A2.value === correct.Q2) score++;

    const A3 = this.querySelector('input[name="Q3"]:checked');
    if (A3.value === correct.Q3) score++;

    const A4 = this.elements['Q4'].value.trim().toLowerCase();
    if (A4 == correct.Q4.toLowerCase()) score++;

    localStorage.setItem('score', score);

    window.location.href = 'pages/results.html';
  });
}

// Results page
const score = Number(localStorage.getItem('score'));

const gif = document.getElementById('resultGif');
const scoreMess = document.getElementById('resultScore');

if(gif && scoreMess) {
  scoreMess.textContent = 'You scored ' + score;

  if (score < 3) {
    gif.src = "/assets/sad.gif";
  } else if (score == 3) {
    gif.src = '/assets/edp.gif';
  } else {
    gif.src = '/assets/rad.gif';
  }
}

