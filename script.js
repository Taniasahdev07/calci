// SOUND
function playSound(type) {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "number") osc.frequency.value = 500;
    else if (type === "operator") osc.frequency.value = 300;
    else if (type === "equal") osc.frequency.value = 800;

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
}

// FUNCTIONS
function appendValue(v) {
    if (!isNaN(v)) playSound("number");
    else playSound("operator");
    display.value += v;
}

function clearDisplay() {
    playSound("operator");
    display.value = "";
}

// HISTORY
function addToHistory(exp, res) {
    let history = JSON.parse(sessionStorage.getItem("calcHistory")) || [];
    history.unshift(exp + " = " + res);
    history = history.slice(0, 10);
    sessionStorage.setItem("calcHistory", JSON.stringify(history));
    showHistory();
}

function showHistory() {
    let h = JSON.parse(sessionStorage.getItem("calcHistory")) || [];
    historyDiv.innerHTML = "";
    h.forEach(item => {
        let d = document.createElement("div");
        d.textContent = item;
        historyDiv.appendChild(d);
    });
}

// CALCULATE
function calculate() {
    playSound("equal");
    try {
        let exp = display.value;
        let res = Function('"use strict";return (' + exp + ')')();
        display.value = res;
        addToHistory(exp, res);
    } catch {
        display.value = "Error";
    }
}

// THEME
let t = 0;
function toggleTheme() {
    document.body.classList.remove("dark", "neon");
    if (t === 0) { document.body.classList.add("dark"); t = 1; }
    else if (t === 1) { document.body.classList.add("neon"); t = 2; }
    else { t = 0; }
}

// KEYBOARD
document.addEventListener("keydown", e => {
    let k = e.key;
    if (!isNaN(k)) appendValue(k);
    else if ("+-*/.".includes(k)) appendValue(k);
    else if (k === "Enter") calculate();
    else if (k === "Backspace") display.value = display.value.slice(0, -1);
    else if (k === "Escape") clearDisplay();
});

// INIT
let display = document.getElementById("display");
let historyDiv = document.getElementById("history");
window.onload = showHistory;
