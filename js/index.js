/* a Xs and Os game using Howler.js*/


/* user interface */

/* jquery ui dialogs for game information */
$("#startDialog").dialog({
  dialogClass: "no-close no-select",
  draggable: false,
  resizable: false,
  modal: true,

  position: {
    my: 'top',
    at: 'top+220'
  },
  show: {
    effect: "slide",
    duration: 500,
    direction: "up"
  },

  /* for selecting the symbol with tab and space */
  open: function() {
    $('.jq-xo-btn').hover(function() {
      $(this).focus();
    });
  },
  closeOnEscape: false,
  buttons: [{
    text: "\"X\"",
    class: "jq-xo-btn",
    click: function() {
      setPlayerChar('X');
      $(".jq-xo-btn:nth-child(1)").addClass("symbol-selected");
      $(this).dialog("close");
      $("#levelDialog").dialog("open");
    }
  }, {
    text: "\"O\"",
    class: "jq-xo-btn",
    click: function() {
      setPlayerChar('O');
      $(".jq-xo-btn:nth-child(2)").addClass("symbol-selected");
      $(this).dialog("close");
      $("#levelDialog").dialog("open");
    }
  }]
});

$("#levelDialog").dialog({
  dialogClass: "no-close levelDialog no-select",
  draggable: false,
  resizable: false,
  modal: true,
  autoOpen: false,
  height: 200,
  position: {
    my: 'top',
    at: 'top+220'
  },
  closeOnEscape: false,
  show: {
    effect: "slide",
    duration: 500,
    direction: "up"
  },
  buttons: [{
      text: "Easy",
      class: "jq-level-btn",
      click: function() {
        gameMemory.easyMode = true;
        initializeGame();
        $(this).dialog("close");
      }
    }, {
      text: "Hard",
      class: "jq-level-btn",
      click: function() {
        gameMemory.easyMode = false;
        initializeGame();
        $(this).dialog("close");

      }
    }

  ]
});

$("#endDialog").dialog({
  dialogClass: "no-close gameOverDialog no-select",
  draggable: false,
  resizable: false,
  modal: true,
  autoOpen: false,
  height: 235,
  position: {
    my: 'top',
    at: 'top+220'
  },
  closeOnEscape: false,
  buttons: [{
    text: "Start",
    class: "jq-reset-btn",
    click: function() {
      resetMemory();
      changeBackground();
      $(this).dialog("close");
    }
  }]
});

/* jquery helper functions */

/* disables enter key in dialog */
$(document).keydown(function(e) {
  if (e.keyCode == 13) {
    return false;
  }
});

// auto-center jQuery UI dialog when resizing browser
$(window).resize(function() {
  $("#startDialog").dialog("option", "position", {
    my: "center",
    at: "center",
    of: window
  });
  $("#levelDialog").dialog("option", "position", {
    my: "center",
    at: "center",
    of: window
  });
  $("#endDialog").dialog("option", "position", {
    my: "center",
    at: "center",
    of: window
  });

});

/* sounds */

function playClickSound() {

  var sound = new Howl({
	  urls: ['assets/sounds/click.mp3']
  }).play();
 
};

function playFailSound() {

  var sound = new Howl({
  	urls: ['assets/sounds/fail.mp3']
  }).play();

};

function playWinSound() {

  var sound = new Howl({
  	urls: ['assets/sounds/win.mp3']
  }).play();

};

function playGameOverSound(msg) {
  var audiodelay = 400;

  window.setTimeout(function() {
    if (msg == "fail") {
      playFailSound();
    } else if (msg == "win") {
      playWinSound();
    }
  }, audiodelay);
};

/* js helper clases */

// changes pointer and colour when hovered over button
$("#game-board > button").bind('mousemove', function() {
  if (!gameMemory.gameOver && gameMemory.playerTurn && !($(this).hasClass("field-taken"))) {
    $(this).addClass("pointercursor").addClass("field-lights");
  }
});

// removes pointer and color when mouse moves away from button
$("#game-board > button").bind('mouseout', function() {
  $(this).removeClass("field-lights");
});

/* easter egg logic */

var clicksOnHiddenLetter = 0;

$(".easterEggLetter").click(function() {
  clicksOnHiddenLetter++;
  if (clicksOnHiddenLetter >= 5) {
    clicksOnHiddenLetter = 0;
    $(".easterEggLink")[0].click();
  }
});

/* changes the background color every round */
function changeBackground() {
  var bgcolor = $("body").css("background-color");

  switch (bgcolor) {
    case "rgb(211, 217, 246)":
      $("body").css("background-color", "rgb(255,203,211)");
      break;
    case "rgb(255, 203, 211)":
      $("body").css("background-color", "rgb(255,253,208)");

      break;
    case "rgb(255, 253, 208)":
      $("body").css("background-color", "rgb(211, 217, 246)");
      break;

  }
}

/* game logic */

/* game state */
var gameMemory = {
  playerChar: undefined,
  compChar: undefined,
  playerTurn: false,
  compMove: 0,
  board: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  gameOver: false,
  easyMode: false
};

function resetMemory() {
  gameMemory.compMove = 0;
  gameMemory.gameOver = false;
  gameMemory.playerTurn = false;
  gameMemory.board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
  $("#game-board > button").text("");
  $("#game-board > button").removeClass("o-style").removeClass("x-style");
  $("#game-img").attr("src", "");
  $("#game-board > button").removeClass("field-taken");
  initializeGame();

};

function setPlayerChar(c) {
  gameMemory.playerChar = c;
};

/* logic for initializing the game */

function initializeGame() {

  if (gameMemory.playerChar == 'X') {
    gameMemory.compChar = 'O';
    gameMemory.playerTurn = true;
  } else {

    gameMemory.compChar = 'X';
    generateCompMove();
  }
};

/* functions for the game loop */

function getRandomInteger(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

function triggerClick(n) {

  setSymbol($("button[gamepos='" + n + "']"), "computer");

};

/* checks for empty state on a given position of a button */
function isEmptyField(pos) {
  return (gameMemory.board[pos - 1] === -1);
};

// starts in the center
function startFromCenter() {
  triggerClick(5);
};

/* starts in a random corner */
function startFromCorner() {

  var pos = -1;

  while (pos < 0 || pos === 2 || (4 <= pos && pos <= 6) || pos === 8) {
    pos = getRandomInteger(1, 9);
  }
  triggerClick(pos);
};

function continueInRandomCorner() {
  var pos = -1;

  while (pos < 0 || pos === 2 || (4 <= pos && pos <= 6) || pos === 8 || !isEmptyField(pos)) {
    pos = getRandomInteger(1, 9);
  }
  triggerClick(pos);
};

function continueOnSide() {
  var pos = -1;

  while (pos < 0 || pos === 3 || pos === 5 || pos === 7 || !isEmptyField(pos) || !hasSideEmptyNeighbours(pos)) {
    pos = getRandomInteger(2, 8);
  }
  triggerClick(pos);
};

function continueOnSideWithEmptyAndCompNeighbours() {

  var pos = -1;

  while (pos < 0 || pos === 3 || pos === 5 || pos === 7 || !isEmptyField(pos) || !hasSideWithEmptyAndCompNeighbours(pos)) {
    pos = getRandomInteger(2, 8);
  }
  triggerClick(pos);

};

function continueOnRandomSideField() {
  var pos = -1;

  while (pos < 0 || pos === 3 || pos === 5 || pos === 7 || !isEmptyField(pos)) {
    pos = getRandomInteger(2, 8);
  }
  triggerClick(pos);
};

function emptySideFieldsExists() {

  if (isEmptyField(2)) {
    return true;
  }
  if (isEmptyField(4)) {
    return true;
  }
  if (isEmptyField(6)) {
    return true;
  }
  if (isEmptyField(8)) {
    return true;
  }
  return false;

};

function emptyFieldExists() {

  for (var i in gameMemory.board) {
    if (gameMemory.board[i] === -1) {
      return true;
    }
  }
  return false;

};

function continueOnRandomEmptyField() {

  var pos = -1;

  while (pos < 0 || !isEmptyField(pos)) {
    pos = getRandomInteger(1, 9);
  }
  triggerClick(pos);

};

function hasSideWithEmptyAndCompNeighbours(pos) {
  var b = gameMemory.board;
  var s = gameMemory.compChar;

  switch (pos) {
    case 2:
      if ((b[0] === -1) && (b[2] === s) || (b[0] === s) && (b[2] === -1)) {
        return true;
      }
    case 4:
      if ((b[0] === -1) && (b[6] === s) || (b[0] === s) && (b[6] === -1)) {
        return true;
      }
    case 6:
      if ((b[2] === -1) && (b[8] === s) || (b[2] === s) && (b[8] === -1)) {
        return true;
      }
    case 8:
      if ((b[6] === -1) && (b[8] === s) || (b[6] === s) && (b[8] === -1)) {
        return true;
      }

  }

  return false;
};

function hasSideEmptyNeighbours(pos) {

  var b = gameMemory.board;

  switch (pos) {
    case 2:
      if ((b[0] === -1) && (b[2] === -1)) {
        return true;
      }
    case 4:
      if ((b[0] === -1) && (b[6] === -1)) {
        return true;
      }
    case 6:
      if ((b[2] === -1) && (b[8] === -1)) {
        return true;
      }
    case 8:
      if ((b[6] === -1) && (b[8] === -1)) {
        return true;
      }

  }

  return false;
};

function sideWithEmptyAndCompNeighboursExists() {

  var s = gameMemory.compChar;
  var b = gameMemory.board;

  if ((b[0] === -1) && (b[2] === s) || (b[0] === s) && (b[2] === -1)) {
    if (isEmptyField(2)) {
      return true;
    }
  }
  if ((b[0] === -1) && (b[6] === s) || (b[0] === s) && (b[6] === -1)) {
    if (isEmptyField(4)) {
      return true;
    }
  }
  if ((b[2] === -1) && (b[8] === s) || (b[2] === s) && (b[8] === -1)) {
    if (isEmptyField(6)) {
      return true;
    }
  }
  if ((b[6] === -1) && (b[8] === s) || (b[6] === s) && (b[8] === -1)) {
    if (isEmptyField(8)) {
      return true;
    }
  }
  return false;
};

/* returns true if a side field exists with two empty neighbours */
function sideWithEmptyNeighboursExists() {

  var b = gameMemory.board;
  if ((b[0] === -1) && (b[2] === -1)) {
    if (isEmptyField(2)) {
      return true;
    }
  }

  if ((b[6] === -1) && (b[8] === -1)) {
    if (isEmptyField(8)) {
      return true;
    }
  }

  if ((b[0] === -1) && (b[6] === -1)) {
    if (isEmptyField(4)) {
      return true;
    }
  }

  if ((b[2] === -1) && (b[8] === -1)) {
    if (isEmptyField(6)) {
      return true;
    }
  }
  return false;
};

function humanStartedFromCenter() {
  if (gameMemory.board[4] === gameMemory.playerChar) {
    return true;
  }
  return false;
};

function humanStartedFromCorner() {
  if ((gameMemory.board[0] === gameMemory.playerChar) || (gameMemory.board[2] === gameMemory.playerChar) || (gameMemory.board[6] === gameMemory.playerChar) || (gameMemory.board[8] === gameMemory.playerChar)) {
    return true;
  }
  return false;
};

function humanStartedFromSide() {
  if ((gameMemory.board[1] === gameMemory.playerChar) || (gameMemory.board[3] === gameMemory.playerChar) || (gameMemory.board[5] === gameMemory.playerChar) || (gameMemory.board[7] === gameMemory.playerChar)) {
    return true;
  }
  return false;
};

function getCornerPosInBetweenHumanSymbols() {

  var b = gameMemory.board;
  var s = gameMemory.playerChar;

  if (isEmptyField(1) && (b[1] === s) && (b[3] === s)) {
    return 1;
  }
  if (isEmptyField(3) && (b[1] === s) && (b[5] === s)) {
    return 3;
  }
  if (isEmptyField(7) && (b[7] === s) && (b[3] === s)) {
    return 7;
  }
  if (isEmptyField(9) && (b[7] === s) && (b[5] === s)) {
    return 9;
  }
};

function continueInCornerBetweenXSymbols() {

  var pos = getCornerPosInBetweenHumanSymbols();

  if (pos) {
    triggerClick(pos);
    return true;
  }
  return false;

};

function blockHuman() {
  return posOfEmptyFieldInLine("human");
};

function completeCompLine() {
  return posOfEmptyFieldInLine("computer");
};

/* returns the position of a field that should be choosen to complete a line */
function posOfEmptyFieldInLine(player) {
  var p;

  switch (player) {
    case "human":
      p = gameMemory.playerChar;
      break;
    case "computer":
      p = gameMemory.compChar;
      break;
  }

  var b = gameMemory.board;

  var pos = -1;

  for (var i = 0; i <= 6; i += 3) {

    if (b[0 + i] === p && b[1 + i] === p) {
      if (isEmptyField(3 + i)) {
        pos = 3 + i;
      }
    } else if (b[0 + i] === p && b[2 + i] === p) {
      if (isEmptyField(2 + i)) {
        pos = 2 + i;
      }
    } else if (b[1 + i] === p && b[2 + i] === p) {
      if (isEmptyField(1 + i)) {
        pos = 1 + i;
      }
    }
  }

  for (var i = 0; i <= 2; i++) {

    if (b[0 + i] === p && b[3 + i] === p) {
      if (isEmptyField(7 + i)) {
        pos = 7 + i;
      }
    } else if (b[0 + i] === p && b[6 + i] === p) {
      if (isEmptyField(4 + i)) {
        pos = 4 + i;
      }
    } else if (b[3 + i] === p && b[6 + i] === p) {
      if (isEmptyField(1 + i)) {
        pos = 1 + i;
      }
    }
  }

  for (var i = 0; i <= 2; i += 2) {
    if (b[0 + i] === p && b[4] === p) {
      if (isEmptyField(9 - i)) {
        pos = 9 - i;
      }
    } else if (b[0 + i] === p && b[8 - i] === p) {
      if (isEmptyField(5)) {
        pos = 5;
      }
    } else if (b[4] === p && b[8 - i] === p) {
      if (isEmptyField(1 + i)) {
        pos = 1 + i;
      }
    }
  }

  if (pos > 0) {
    triggerClick(pos);
    return true;
  }
  return false;

};

function cornerWithFreeNeighboursExists() {

  if (isEmptyField(1) && isEmptyField(2) && isEmptyField(4) && isEmptyField(5)) {
    return true;
  }
  if (isEmptyField(2) && isEmptyField(3) && isEmptyField(5) && isEmptyField(6)) {
    return true;
  }
  if (isEmptyField(7) && isEmptyField(8) && isEmptyField(4) && isEmptyField(5)) {
    return true;
  }
  if (isEmptyField(4) && isEmptyField(5) && isEmptyField(8) && isEmptyField(9)) {
    return true;
  }

  return false;

};

function hasCornerFreeNeighbours(pos) {

  switch (pos) {
    case 1:
      if (isEmptyField(2) && isEmptyField(4) && isEmptyField(5)) {
        return true;
      }
      break;
    case 3:
      if (isEmptyField(2) && isEmptyField(5) && isEmptyField(6)) {
        return true;
      }
      break;
    case 7:
      if (isEmptyField(8) && isEmptyField(4) && isEmptyField(5)) {
        return true;
      }
      break;
    case 9:
      if (isEmptyField(8) && isEmptyField(5) && isEmptyField(6)) {
        return true;
      }
      break;
  }
  return false;

};

function continueInCornerWithFreeNeighbours() {

  var pos = -1;

  while (pos < 0 || pos === 2 || (4 <= pos && pos <= 6) || pos === 8 || !isEmptyField(pos) || !hasCornerFreeNeighbours(pos)) {
    pos = getRandomInteger(1, 9);
  }
  triggerClick(pos);

};

function generateCompMove() {
  if (!gameMemory.gameOver) {
    var pos = -1;
    if (gameMemory.easyMode) {
      while (!isEmptyField(pos)) {
        pos = getRandomInteger(1, 9);
      }
      triggerClick(pos);
    } else {
      // hard mode
      if (gameMemory.compMove === 0) {
        // generate first computer move

        if (gameMemory.playerChar === 'X') {
          // human starts, we need to counterattack

          // counterattack depends on the position the human player choose
          if (humanStartedFromSide()) {
            startFromCenter();
          } else if (humanStartedFromCenter()) {
            startFromCorner();
          } else if (humanStartedFromCorner()) {
            startFromCenter();
          }

        } else {
          // computer starts, put first symbol on the board

          // with 80% start from the corner, with 20% start from the center
          if (getRandomInteger(1, 5) === 5) {
            startFromCenter();
          } else {
            startFromCorner();
          }
        }

      } else if (gameMemory.compMove >= 1) {
        // block almost completed lines from the opponent
        if (!completeCompLine()) {
          if (!blockHuman()) {
            if (humanStartedFromCorner()) {
              if (sideWithEmptyNeighboursExists()) {
                continueOnSide();
              } else {
                // if no side field with two empty neigbours exists,
                // choose a side field with one empty and one computer field as neighbours

                if (sideWithEmptyAndCompNeighboursExists()) {
                  continueOnSideWithEmptyAndCompNeighbours();
                } else {
                  // choose a random side field
                  if (emptySideFieldsExists()) {

                    continueOnRandomSideField();
                  } else {
                    // pick a random empty field
                    if (emptyFieldExists) {
                      continueOnRandomEmptyField();
                    }

                  }

                }
              }
            } else {
              // place the next symbol in the corner between the two human symbols 
              if (!continueInCornerBetweenXSymbols()) {

                // pick another field so there will be an empty space between two computer symbols
                if (cornerWithFreeNeighboursExists()) {
                  continueInCornerWithFreeNeighbours();
                } else {

                  // choose a random free corner 
                  continueInRandomCorner();
                }
              }
            }
          }

        }

      }
    }
  }

  /* check whether game is over */
  checkGameOver();
};

/* sets a symbol on the board */
function setSymbol(clickedButton, player) {
  var symbol;

  /* determines the symbol of the move */
  switch (player) {
    case "human":
      var symbol = gameMemory.playerChar;
      break;
    case "computer":
      var symbol = gameMemory.compChar;
      break;
  }

  /* determines the position on the board */
  var pos = $(clickedButton).attr("gamepos");

  if (isEmptyField(pos)) {
    /* selected pos is empty */
    gameMemory.board[pos - 1] = symbol;
    $(clickedButton).text(symbol);

    switch (symbol) {
      case 'X':
        $(clickedButton).removeClass("o-style").addClass("x-style");
        break;
      case 'O':
        $(clickedButton).removeClass("x-style").addClass("o-style");
        break;
    }

    $(clickedButton).addClass("field-lights");
    window.setTimeout(function() {

      $(clickedButton).removeClass("field-lights");
      $(clickedButton).addClass("field-taken");

    }, 500);

    if (player == "computer") {

      /* change turns */
      gameMemory.playerTurn = true;
      gameMemory.compMove++;

    }
    if (player == "human") {
      playClickSound();
    }

  }
};

$("#game-board > button").click(function() {

  if (gameMemory.playerTurn && isEmptyField($(this).attr("gamepos")) && !gameMemory.gameOver) {
    gameMemory.playerTurn = false;
    // removes cursor pointer while computers turn
    $("#game-board > button").removeClass("pointercursor");
    setSymbol(this, "human");
    checkGameOver();

    /* generate answer */
    /* delays the computer reaction to make it more natural*/
    window.setTimeout(function() {

      generateCompMove();
    }, 1000);

  }

});

/* logic for ending the current game */

function checkGameOver() {

  checkWin("human");
  checkWin("computer");
  checkDraw();

};

function checkWin(player) {
  if (!gameMemory.gameOver) {
    var b = gameMemory.board;
    var s;
    var msg;
    switch (player) {
      case "human":
        s = gameMemory.playerChar;
        msg = "win";
        break;
      case "computer":
        s = gameMemory.compChar;
        msg = "fail";
        break;
    }

    var check = false;
    var completeline = [];

    // check for complete rows
    for (var i = 0; i <= 6; i += 3) {
      if ((b[0 + i] === b[1 + i]) && (b[1 + i] === b[2 + i]) && (b[2 + i] === s)) {
        check = true;
        completeline.push(0 + i);
        completeline.push(1 + i);
        completeline.push(2 + i);
      }
    }
    // check for complete columns
    for (var i = 0; i <= 2; i++) {
      if ((b[0 + i] === b[3 + i]) && (b[3 + i] === b[6 + i]) && (b[6 + i] === s)) {
        check = true;
        completeline.push(0 + i);
        completeline.push(3 + i);
        completeline.push(6 + i);
      }
    }

    // check for complete diagonal lines
    for (var i = 0; i <= 2; i += 2) {

      if ((b[0 + i] === b[4]) && (b[4] === b[8 - i]) && (b[8 - i] === s)) {
        check = true;
        completeline.push(0 + i);
        completeline.push(4);
        completeline.push(8 - i);
      }
    }

  }

  if (check === true) {
    endGame();
    playGameOverSound(msg);
    for (var i of completeline) {
      var gamepos = i + 1;
      /* blinks the complete line and shows a dialog to the user */
      showGameOverInfo(gamepos, 3, 500, msg);
    }
  }

};

/* checks whether there is no winner */
function checkDraw() {

  if (!gameMemory.gameOver) {
    /* no empty field left on the board */
    if (gameMemory.board.indexOf(-1) === -1) {
      endGame();
      showGameOverDialog("draw");
    }
  }
};

/* ends the current game */
function endGame() {
  // removes hovering effect on buttons
  $("#game-board > button").removeClass("pointercursor");
  gameMemory.gameOver = true;
  $("#game-board > button").addClass("field-taken");
};

// blinks the completed line and shows the game over-dialog
function showGameOverInfo(field, n, timeout, msg) {
  var lightdur = 400;

  window.setTimeout(function() {

    $("button[gamepos='" + field + "']").removeClass("field-taken").addClass("field-lights");

    window.setTimeout(function() {
      $("button[gamepos='" + field + "']").addClass("field-taken").removeClass("field-lights");
      // light another time
      if (n > 1) {
        showGameOverInfo(field, n - 1, lightdur, msg);
      } else {
        showGameOverDialog(msg);
      }

      // how long should the field light
    }, lightdur);
  }, timeout);

};

function showGameOverDialog(msg) {

  var delay = 300;
  var imgpath = "";

  if (msg == "fail") {
    imgpath = "assets/emoticons/cry.png";
  } else if (msg == "draw") {
    imgpath = "assets/emoticons/disgruntled.png";
    delay *= 5;
  } else if (msg == "win") {
    imgpath = "assets/emoticons/happy.png";
  }
  $("#game-img").attr("src", imgpath);
  window.setTimeout(function() {
    $("#endDialog").dialog("open");
  }, delay);
};