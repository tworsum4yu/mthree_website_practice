const score = Number(localStorage.getItem("score"));

const gif = document.getElementById("resultGif");
const scoreMess = document.getElementById("resultScore");

scoreMess.textContent = "You scored " + score;

if (score < 3) {
    gif.src = "../assets/sad-spiderman.gif";
}
else if (score == 3) {
    gif.src = "../assets/edp-i-mean-its-all-right.gif";
}
else {
    gif.src = "../assets/thumbs-up-that's-rad.gif";
}