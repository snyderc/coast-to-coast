// Game Engine:
// On load, call loadAssets()
// When loadAssets done, it resolves promise, triggering showStartGameButton
// When user completes showStartGameButton (clicks on button), go to requestUserName
// When user completes requestUserName (clicks on button), go to initializeGame
// When initializeGame done, it calls showStartTurnButton
// When user completes initializeTurn (clicks on button), go to startTurn
// startTurn either calls startHumanTurn or startComputerTurn
// showTurnButtons -> showAnswerPrompt -> processMove. processComputerTurn -> processMove
// When user completes showTurnButtons (clicks equal sign), go to showAnswerPrompt
// When user completes showAnswerPrompt (presses Enter), go to processMove
// When processMove done, it either calls:
// -- showStartTurnButton if win condition has not been met
// -- endGame if win condition has been met
// User can complete endGame by clicking "New Game" -- goes to initializeGame()

// Game Graphics:
// During game, "Board" (gameboard) and "Display Area" (text, buttons, etc.)

// Game state is kept here
const gameVars = {
    pregame: true,             // Screen will only have board painted if pregame === false
    textAndButtonsToDraw: [],  // Array of elements to draw in Display Area (non-board area) or during pregame
    landmarks: [
      10,
      20,
      30,
      40
    ],
    finish: 50,
    shortcuts: [    // Hard-coded now. Display is also hard-coded.
      {
        start: 5,
        end: 14
      },
      {
        start: 26,
        end: 35
      }
    ],
    // Turn Variables
    turnRandomNumbers: [],
    turnEntryStack: [],
    currentPlayer: undefined,
    otherPlayer: undefined,
    // Game Variables
    numberOfGamesPlayed: 0,
    goesFirst: undefined,
    gameOver: false,
    // Players
    playerOne: {
        name: undefined,
        score: 0,
        type: 'human',
        carName: 'redCar'
    },
    playerTwo: {
        name: 'Blue Racer',
        score: 0,
        type: 'computer',
        carName: 'blueCar'
    },
    // Cars
    carPositions: {
        redCar: {
            x: -50,
            y: -50,
            futurePositions: [],
            dir: 'right'
        },
        blueCar: {
            x: -50,
            y: -50,
            futurePositions: [],
            dir: 'right'
        }
    }
}

// Global constants

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const images = {};
const dictOfCarCoords = {};

// Getters and Setters for gameVars

function setPlayerOneName(name) {
    gameVars.playerOne.name = name;
}
  
function setTurnRandomNumbers() {
    // First, clear out existing random numbers
    gameVars.turnRandomNumbers.length = 0;
    // first random number: 1-3
    gameVars.turnRandomNumbers.push(Math.floor(Math.random()*3+1));
    // second random number: 0-4
    gameVars.turnRandomNumbers.push(Math.floor(Math.random()*5));
    // third random number: 1-7
    gameVars.turnRandomNumbers.push(Math.floor(Math.random()*7+1));
}

function clearTurnRandomNumbers() {
    gameVars.turnRandomNumbers.length = 0;
}

function clearTurnEntryStack() {
    gameVars.turnEntryStack.length = 0;
}

//
// Game Engine functions
//

function loadAssets() {
    // Draw "Loading..." text on canvas
    gameVars.textAndButtonsToDraw.push(messages.gameLoading);
    window.requestAnimationFrame(drawScreen);

    // Initializes car coordinate dictionary
    initializeCarCoords();

    // Loads images from files, then callback is showStartGameButton
    loadImages(imageUrls, images, function() {
        // Clear text/button array and call showStartGameButton
        gameVars.textAndButtonsToDraw.length = 0;
        showStartGameButton();
    });
}

function showStartGameButton() {
    // Draw Coast to Coast name and start game button
    gameVars.textAndButtonsToDraw.push(messages.coastToCoastName);
    gameVars.textAndButtonsToDraw.push(messages.startGameButton);
    gameVars.textAndButtonsToDraw.push(messages.startGameRedCarDecoration);
    gameVars.textAndButtonsToDraw.push(messages.startGameBlueCarDecoration);
    gameVars.textAndButtonsToDraw.push(messages.rules1);
    gameVars.textAndButtonsToDraw.push(messages.rules2);
    gameVars.textAndButtonsToDraw.push(messages.rules3);
    gameVars.textAndButtonsToDraw.push(messages.rules4);
    gameVars.textAndButtonsToDraw.push(messages.rules5);
    gameVars.textAndButtonsToDraw.push(messages.rules6);
    // Add click event listener to canvas
    canvas.addEventListener('click', clickListenerCallback);
    // Draw text/buttons
    window.requestAnimationFrame(drawScreen);
}

// Version 1 of game won't customize the display with the user's name.
// function requestUserName() {
//     // Queue elements to draw to screen
//     gameVars.textAndButtonsToDraw.push(messages.whatIsYourNameText);
//     gameVars.textAndButtonsToDraw.push(messages.whatIsYourNameInputBox);
//     messages.whatIsYourNameUserInput.value = "";
//     gameVars.textAndButtonsToDraw.push(messages.whatIsYourNameUserInput);
//     // Add keypress listener to window
//     window.addEventListener('keydown', function _keydownListener(event) {
//         keydownListenerCallback(event, messages.whatIsYourNameUserInput, "letters", 15, function(name) {
//             setPlayerOneName(name.trim());
//             gameVars.textAndButtonsToDraw.length = 0;
//             window.removeEventListener('keydown', _keydownListener);
//             initializeGame();
//         });
//     });
//     // Draw text/buttons
//     // Once pregame === false, drawing will be handled by a different function
//     if (gameVars.pregame === true) {
//         window.requestAnimationFrame(drawScreen);
//     }
// }

function initializeGame() {
    // If this is the first game, display a welcome message to the user
    if (gameVars.numberOfGamesPlayed === 0) {
        gameVars.pregame = false;
        gameVars.textAndButtonsToDraw.push(messages.welcomeMessageRed);
        gameVars.textAndButtonsToDraw.push(messages.welcomeMessageBlue);
    }

    // Set who goes first (P1 for odd-numbered games; P2 for even-numbered games)
    gameVars.numberOfGamesPlayed++;
    if (gameVars.numberOfGamesPlayed % 2 === 0) {
        gameVars.goesFirst = gameVars.playerTwo;
        gameVars.textAndButtonsToDraw.push(messages.newGameMessageBlue);
    }
    else {
        gameVars.goesFirst = gameVars.playerOne;
        gameVars.textAndButtonsToDraw.push(messages.newGameMessageRed);
    }
    // Set both player scores to 0
    gameVars.playerOne.score = 0;
    gameVars.playerTwo.score = 0;

    // Reset car positions
    gameVars.carPositions.redCar.x = dictOfCarCoords[gameVars.playerOne.score].redCar.x;
    gameVars.carPositions.redCar.y = dictOfCarCoords[gameVars.playerOne.score].redCar.y;
    gameVars.carPositions.blueCar.x = dictOfCarCoords[gameVars.playerTwo.score].blueCar.x;
    gameVars.carPositions.blueCar.y = dictOfCarCoords[gameVars.playerTwo.score].blueCar.y;

    // Reset currentPlayer and otherPlayer
    gameVars.currentPlayer = undefined;
    gameVars.otherPlayer = undefined;

    // TODO (future feature): Clear shortcut array and set array of shortcut start and end points from a list of constraints
    // NOTE: When you implement that feature, also change the drawShortcuts function so it draws the points dynamically

    // Paint screen (which will now show board b/c no longer in pregame)
    window.requestAnimationFrame(drawScreen);
    return initializeTurn();
}

function initializeTurn() {
    // If beginning of game, set the current player to goesFirst
    if (gameVars.currentPlayer === undefined) {
        gameVars.currentPlayer = gameVars.goesFirst;
        if (gameVars.playerOne !== gameVars.currentPlayer) {
            gameVars.otherPlayer = gameVars.playerOne;
        }
        else {
            gameVars.otherPlayer = gameVars.playerTwo;
        }
    }
    else {
        // Before you swap the current player and other player, check win condition first
        // Win Condition:
        // If player who goes first reaches 50, other player has 1 turn to also reach 50.
        // If the current player from previous turn reached 50, and they didn't go first, they win
        // If the other player has score 50, and current player didn't reach a score of 50, other player wins
        // Otherwise, gameplay continues
        if (gameVars.currentPlayer.score === 50 && gameVars.otherPlayer.score === 50) {
            return endGame("tie");
        }
        // If current player didn't go first, current player wins
        else if (gameVars.currentPlayer.score === 50 && gameVars.currentPlayer != gameVars.goesFirst) {
            return endGame("win", gameVars.currentPlayer);
        }
        else if (gameVars.otherPlayer.score === 50) {
            // If other player already had 50 points, and current player didn't get to 50 last turn, other player wins
            return endGame("win", gameVars.otherPlayer);
        }

        // Swap current player and other player
        const tempPlayer = gameVars.currentPlayer;
        gameVars.currentPlayer = gameVars.otherPlayer;
        gameVars.otherPlayer = tempPlayer;

        // Show a message about whose turn it is
        if (gameVars.currentPlayer.type === "human") {
            gameVars.textAndButtonsToDraw.push(messages.nextTurnMessageHuman);
        }
        else if (gameVars.currentPlayer.type === "computer") {
            gameVars.textAndButtonsToDraw.push(messages.nextTurnMessageComputer);
        }
    }

    // Reset turn variables
    clearTurnEntryStack();
    setTurnRandomNumbers();
    gameVars.correctEquationAndAnswer = undefined;

    gameVars.textAndButtonsToDraw.push(messages.startTurnButton);

    canvas.addEventListener("click", clickListenerCallback);

    window.requestAnimationFrame(drawScreen);
}

function startTurn() {
    function startComputerTurn() {
        // console.log("In startComputerTurn()");
        // Display the 3 random numbers the computer is working with
        messages.computerTurnRandomNumbersDisplay.value = `Computer's numbers: ${gameVars.turnRandomNumbers}`;
        gameVars.textAndButtonsToDraw.push(messages.computerTurnRandomNumbersDisplay);
        window.requestAnimationFrame(drawScreen);
        const result = runComputerAi(gameVars.turnRandomNumbers, gameVars.currentPlayer.score, gameVars.otherPlayer.score);
        // console.log(gameVars.turnRandomNumbers);
        // console.log(result);
        messages.displayCorrectEquation.value = `${result.formulaForMove.formula} = ${result.formulaForMove.result}`;
        processMove(result.formulaForMove.formula, result.formulaForMove.result);
    }

    function startHumanTurn() {
        // console.log("In startHumanTurn()");
        function showTurnButtons() {
            for (let i = 0; i < messages.turnButtons.length; i++) {
                // Set the three numbers to be used on this turn, from the array turnRandomNumbers
                if (messages.turnButtons[i].name === "First Number Button") {
                    messages.turnButtons[i].value = gameVars.turnRandomNumbers[0].toString();
                }
                else if (messages.turnButtons[i].name === "Second Number Button") {
                    messages.turnButtons[i].value = gameVars.turnRandomNumbers[1].toString();
                }
                else if (messages.turnButtons[i].name === "Third Number Button") {
                    messages.turnButtons[i].value = gameVars.turnRandomNumbers[2].toString();
                }
                gameVars.textAndButtonsToDraw.push(messages.turnButtons[i]);
            }
            addEventListener("click", clickListenerCallback);
            window.requestAnimationFrame(drawScreen);
        }
        showTurnButtons();
    }

    // Call either startComputerTurn or startHumanTurn depending on the player
    if (gameVars.currentPlayer.type === "human") {
        return startHumanTurn();
    }
    else if (gameVars.currentPlayer.type === "computer") {
        return startComputerTurn();
    }
}

async function processMove(equation, answer) {
    moveOutcome = getMoveOutcome(gameVars.currentPlayer.score, gameVars.otherPlayer.score, answer);
    // console.log(moveOutcome);
    gameVars.textAndButtonsToDraw.push(messages.displayCorrectEquation); // Displays the equation
    // Move current player car based on math
    await moveCar(
        gameVars.currentPlayer.carName,
        moveOutcome.curPlayerOriginalPos,
        moveOutcome.curPlayerPositionAfterMath
    )
    // console.log("First move done");
    // Clear out any old values from the computerTurn function, and redisplay just the equation
    gameVars.textAndButtonsToDraw.length = 0;
    gameVars.textAndButtonsToDraw.push(messages.displayCorrectEquation);
    // If modifier, move current player car
    if (moveOutcome.curPlayerTypeOfModifier !== "none") {
        if (moveOutcome.curPlayerTypeOfModifier === "landmark") {
            gameVars.textAndButtonsToDraw.push(messages.landmarkModifierDisplay);
        }
        else if (moveOutcome.curPlayerTypeOfModifier === "shortcut") {
            gameVars.textAndButtonsToDraw.push(messages.shortcutModifierDisplay);
        }
        await moveCar(
            gameVars.currentPlayer.carName,
            moveOutcome.curPlayerPositionAfterMath,
            moveOutcome.curPlayerFinalPosAfterModifier,
            moveOutcome.curPlayerTypeOfModifier
        )
        // console.log("Second move done");
    }
    // If other player gets displaced, move other player car
    if (moveOutcome.isOtherPlayerDisplaced) {
        gameVars.textAndButtonsToDraw.push(messages.bumpedBackModifierDisplay);
        await moveCar(
            gameVars.otherPlayer.carName,
            moveOutcome.otherPlayerOriginalPos,
            moveOutcome.otherPlayerFinalPos
        )
        // console.log("Third move done");
    }
    // console.log("All moves done");
    // Update scores
    gameVars.currentPlayer.score = moveOutcome.curPlayerFinalPosAfterModifier;
    gameVars.otherPlayer.score = moveOutcome.otherPlayerFinalPos;
    // Prompt user to press Enter to continue. Pressing Enter clears the text display area's array.
    gameVars.textAndButtonsToDraw.push(messages.successfulEndOfTurnMessage);
    window.requestAnimationFrame(drawScreen);
    window.addEventListener("keydown", endTurn);
}

function endGame(outcome, winner = undefined) {
    // console.log("In endGame");
    if (outcome == "tie") {
        gameVars.textAndButtonsToDraw.push(messages.endGameTieMessage);
    }
    else if (winner.type === "human") {
        gameVars.textAndButtonsToDraw.push(messages.endGameHumanWins);
    }
    else if (winner.type === "computer") {
        gameVars.textAndButtonsToDraw.push(messages.endGameComputerWins);
    }
    gameVars.textAndButtonsToDraw.push(messages.endGameNewGameButton);
    canvas.addEventListener("click", clickListenerCallback);
}

loadAssets();