/* Game State */
const game = {
  remain: 9,
  finished: false,
  answer: []
};

/* DOM */
const num1 = document.getElementById("number1");
const num2 = document.getElementById("number2");
const num3 = document.getElementById("number3");

const attemptText = document.getElementById("attempts");
const resultBox = document.getElementById("results");
const submitBtn = document.getElementsByClassName("submit-button")[0];
const resultImg = document.getElementById("game-result-img");

/* 초기화 */
attemptText.textContent = game.remain;
game.answer = generateAnswer();

/* 랜덤 숫자 생성 */
function generateAnswer() {
  const pool = Array.from({ length: 10 }, (_, i) => i);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const result = pool.slice(0, 3);
  console.log("answer:", result);
  return result;
}

/* 입력 초기화 */
function clearInputs() {
  num1.value = "";
  num2.value = "";
  num3.value = "";
}

/* 결과 계산 */
function evaluateGuess(guess, answer) {
  let strike = 0;
  let ball = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === answer[i]) {
      strike++;
    } else if (answer.includes(guess[i])) {
      ball++;
    }
  }

  return {
    strike,
    ball,
    out: strike === 0 && ball === 0
  };
}

/* 결과 출력 */
function renderResult(numbers, result) {
  const row = document.createElement("div");
  row.className = "check-result";

  let html = `${numbers.join(" ")} : `;

  if (result.out) {
    html += `<div class="out num-result">O</div>`;
  } else {
    html += `
      ${result.strike} <div class="strike num-result">S</div>
      ${result.ball} <div class="ball num-result">B</div>
    `;
  }

  row.innerHTML = html;
  resultBox.appendChild(row);
  resultBox.scrollTop = resultBox.scrollHeight;
}

/* 게임 종료 */
function finishGame(success) {
  game.finished = true;
  submitBtn.disabled = true;
  submitBtn.style.cursor = "not-allowed";
  resultImg.src = success ? "success.png" : "fail.png";
}

/* 메인 함수 */
function check_numbers() {
  if (game.finished) return;

  const v1 = num1.value.trim();
  const v2 = num2.value.trim();
  const v3 = num3.value.trim();

  if (v1 === "" || v2 === "" || v3 === "") {
    clearInputs();
    return;
  }

  const guess = [Number(v1), Number(v2), Number(v3)];
  const result = evaluateGuess(guess, game.answer);

  renderResult(guess, result);

  game.remain--;
  attemptText.textContent = game.remain;

  if (result.strike === 3) {
    finishGame(true);
  } else if (game.remain === 0) {
    finishGame(false);
  }

  clearInputs();
}

var footerList = document.getElementsByClassName("footer");
for (var i = 0; i < footerList.length; i++) {
  footerList[i].style.display = "none";
}
