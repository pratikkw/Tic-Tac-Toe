"use strict";

// Elements
const layoutBox = document.querySelector(".layoutBox");
const gameArea = document.querySelector(".gamearea");
const boxes = document.querySelectorAll(".box");

// BTNs
const volumeBtn = document.querySelector(".volume__btn");
const muteVolBtn = document.querySelector(".mute__btn");
const restartBtn = document.querySelector(".restart__btn");

let condition = [
  {
    checkInd: [0, 1, 2],
    moveTo: [15, 50, "translate(-50%, 0%)", "rotate(0deg)"],
  },
  {
    checkInd: [3, 4, 5],
    moveTo: [48, 50, "translate(-50%, 0%)", "rotate(0deg)"],
  },
  {
    checkInd: [6, 7, 8],
    moveTo: [82.5, 50, "translate(-50%, 0%)", "rotate(0deg)"],
  },
  {
    checkInd: [0, 3, 6],
    moveTo: [50, -39, "translate(0%, -50%)", "rotate(90deg)"],
  },
  {
    checkInd: [1, 4, 7],
    moveTo: [50, -5.5, "translate(0%, -50%)", "rotate(90deg)"],
  },
  {
    checkInd: [2, 5, 8],
    moveTo: [50, 28.5, "translate(0%, -50%)", "rotate(90deg)"],
  },
  {
    checkInd: [0, 4, 8],
    moveTo: [50, 51, "translate(-50%, 0%)", "rotate(45deg)"],
  },
  {
    checkInd: [2, 4, 6],
    moveTo: [50, 48, "translate(-50%, 0%)", "rotate(135deg)"],
  },
];
const isScreenWidth = window.matchMedia("(max-width: 500px)").matches;
let turn = "circle";
let gameOver = false;
let volume = true;

// SOUNDs
const sound = new Audio("../Sound/sound.wav");
const touch = new Audio("../Sound/touch.wav");
const resetSound = new Audio("../Sound/restart.mp3");

// --> Change MoveTo Values for screen width <= 500px
function changeMoveTo() {
  if (isScreenWidth) {
    condition[3] = {
      checkInd: [0, 3, 6],
      moveTo: [50, -25.5, "translate(0%, -50%)", "rotate(90deg)"],
    };
    condition[4] = {
      checkInd: [1, 4, 7],
      moveTo: [50, 4.5, "translate(0%, -50%)", "rotate(90deg)"],
    };
    condition[5] = {
      checkInd: [2, 5, 8],
      moveTo: [50, 35, "translate(0%, -50%)", "rotate(90deg)"],
    };
  }
}
// -------------------------------

// --> Sound Effect
function soundEffect(s) {
  if (!volume) return;
  if (s == "vol") {
    sound.play();
  } else if (s == "touch") {
    touch.play();
  } else if (s == "reset") {
    resetSound.play();
  }
}
// -------------------------------

// --> Restart Game
function resetGame() {
  gameOver = false;
  turn = "circle";
  layoutBox.style.setProperty("--display", "none");

  boxes.forEach((item) => {
    let child = item.querySelector(".icon__container");
    if (child) {
      item.dataset.fill = "empty";
      item.removeChild(child);
    }
  });
}
// -------------------------------

// --> Automatic Reset Game
function automaticReset() {
  setTimeout(resetGame, 1 * 1000);
}
// -------------------------------

// --> Check For Draw
function isDraw() {
  let res = [...boxes].every((item) => item.dataset.fill != "empty");

  if (res && gameOver == false) {
    automaticReset();
  }
}
// -------------------------------

// --> Get a Winner
function gotAWinner(w) {
  gameOver = true;
  const move = w.moveTo;
  layoutBox.style.setProperty("--top", move[0]);
  layoutBox.style.setProperty("--left", move[1]);
  layoutBox.style.setProperty("--transform", move[2]);
  layoutBox.style.setProperty("--rotate", move[3]);
  layoutBox.style.setProperty("--display", "block");

  automaticReset();
}
// -------------------------------

// --> Check For Winning Condition
function checkCondition() {
  for (let i = 0; i < condition.length; i++) {
    let tmp = condition[i].checkInd;
    const boxOne = boxes[tmp[0]].dataset.fill;
    const boxTwo = boxes[tmp[1]].dataset.fill;
    const boxThree = boxes[tmp[2]].dataset.fill;
    if (
      boxOne != "empty" &&
      boxTwo != "empty" &&
      boxThree != "empty" &&
      boxOne == boxTwo &&
      boxOne == boxThree &&
      boxTwo == boxThree
    ) {
      gotAWinner(condition[i]);
    }
  }
}
// -------------------------------

// --> Create a Logo
function createEle(t) {
  let logo = t == "circle" ? "ellipse-outline" : "close-outline";
  return `<span class="icon__container ${t}__container">
            <ion-icon class="icon__sym ${t}__icon" name="${logo}"></ion-icon>
          </span>`;
}
// -------------------------------

// --> Fill the Box
function fillBox(ele, t) {
  let sym;
  if (t == "circle") {
    sym = createEle(t);
    ele.dataset.fill = "circle";
    turn = "cross";
  } else if (t == "cross") {
    sym = createEle(t);
    ele.dataset.fill = "cross";
    turn = "circle";
  }
  ele.innerHTML = sym;
}
// -------------------------------

// --> Check for Empty Box
function checkEmpty(ele) {
  const isEmpty = ele.dataset.fill;
  if (isEmpty == "empty") {
    fillBox(ele, turn);
  }
}
// -------------------------------

// --> Mute
function mute() {
  soundEffect("vol");
  volume = false;
  volumeBtn.classList.add("volume--hide");
  muteVolBtn.classList.remove("volume--hide");
}
// -------------------------------

// --> Unmute
function unmute() {
  soundEffect("vol");
  volume = true;
  volumeBtn.classList.remove("volume--hide");
  muteVolBtn.classList.add("volume--hide");
}
// -------------------------------

// EventListener

window.addEventListener("load", changeMoveTo);

document.body.addEventListener(
  "touchmove",
  function (e) {
    if (e.scale != 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

gameArea.addEventListener("click", function (e) {
  const ele = e.target;
  if (gameOver) return;
  if (ele.classList.contains("box")) {
    soundEffect("touch");
    checkEmpty(ele);
    checkCondition();
    isDraw();
  }
});

restartBtn.addEventListener("click", function () {
  soundEffect("reset");
  resetGame();
});

volumeBtn.addEventListener("click", mute);
muteVolBtn.addEventListener("click", unmute);
