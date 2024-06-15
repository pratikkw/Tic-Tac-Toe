"use strict";

// Elements
const gameArea = document.querySelector(".gamearea");
const boxes = document.querySelectorAll(".box");

const condition = [
  { checkInd: [0, 1, 2], angle: [] },
  { checkInd: [3, 4, 5], angle: [] },
  { checkInd: [6, 7, 8], angle: [] },
  { checkInd: [0, 3, 6], angle: [] },
  { checkInd: [1, 4, 7], angle: [] },
  { checkInd: [2, 5, 8], angle: [] },
  { checkInd: [0, 4, 8], angle: [] },
  { checkInd: [2, 4, 6], angle: [] },
];
let turn = "circle";

function gotAWinner(w) {
  console.log(w);
}

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

function fillBox(ele, t) {
  let sym;
  if (t == "circle") {
    sym = `<span class="icon__container circle__container">
            <ion-icon class="icon__sym circle__icon" name="ellipse-outline"></ion-icon>
          </span>`;
    ele.dataset.fill = "circle";
    turn = "cross";
  } else if (t == "cross") {
    sym = `<span class="icon__container cross__container">
            <ion-icon class="icon__sym cross__icon" name="close-outline"></ion-icon>
          </span>`;
    ele.dataset.fill = "cross";
    turn = "circle";
  }
  ele.innerHTML = sym;
}

function checkEmpty(ele) {
  const isEmpty = ele.dataset.fill;
  if (isEmpty == "empty") {
    fillBox(ele, turn);
  }
}

gameArea.addEventListener("click", function (e) {
  const ele = e.target;
  if (ele.classList.contains("box")) {
    checkEmpty(ele);
    checkCondition();
  }
});
