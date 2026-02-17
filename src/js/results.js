const score = Number(localStorage.getItem("score"));

const gif = document.getElementById("resultGif");
const scoreMess = document.getElementById("resultScore");

scoreMess.textContent = "You scored " + score;

if (score < 3) {
    gif.src = "../assets/sad.gif";
}
else if (score == 3) {
    gif.src = "../assets/edp.gif";
}
else {
    gif.src = "../assets/rad.gif";
}