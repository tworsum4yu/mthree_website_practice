document.getElementById("quiz").addEventListener("submit", function (e) {
    e.preventDefault();

    const correct = { 
        Q1: "saiga antelope", 
        Q2: "FALSE", 
        Q3: "W_G",
        Q4: "green"
    };

    let score = 0;

    const A1 = this.elements["Q1"].value.trim();
    if (A1 == correct.Q1) score++;

    const A2 = this.querySelector('input[name="Q2"]:checked');
    if (A2.value === correct.Q2) score++;

    const A3 = this.querySelector('input[name="Q3"]:checked');
    if (A3.value === correct.Q3) score++;

    const A4 =  this.elements["Q4"].value.trim();
    if (A4 == correct.Q4) score++;

    localStorage.setItem("score", score);

    window.location.href = "pages/results.html";

});
