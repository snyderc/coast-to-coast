const messages = {
    gameLoading: {
        type: "text",
        x: 450,
        y: 300,
        value: "Loading..."
    },
    coastToCoastName: {
        type: "text",
        x: 450,
        y: 100,
        value: "Coast to Coast"
    },
    startGameButton: {
        type: "rectangle",
        x: 300,
        y: 150,
        width: 300,
        height: 80,
        value: "Click to Start Game",
        onClick: function() {
            canvas.removeEventListener("click", clickListenerCallback);
            gameVars.textAndButtonsToDraw.length = 0;
            window.requestAnimationFrame(drawScreen);
            // requestUserName(); // Not asking user for their name in version 1 of game
            return initializeGame();
        }
    },
    startGameRedCarDecoration: {
        type: "image",
        x: 220,
        y: 80,
        url: "/images/car-right-red.png"
    },
    startGameBlueCarDecoration: {
        type: "image",
        x: 600,
        y: 80,
        url: "/images/car-left-blue.png"
    },
    rules1: {
        type: "text",
        x: 450,
        y: 350,
        value: "How to Play:"
    },
    rules2: {
        type: "text",
        x: 450,
        y: 400,
        value: "Create an equation that moves your car along the board!"
    },
    rules3: {
        type: "text",
        x: 450,
        y: 440,
        value: "Land on a rest stop and go ahead another rest stop!"
    },
    rules4: {
        type: "text",
        x: 450,
        y: 480,
        value: "Land on another player not at a rest stop"
    },
    rules5: {
        type: "text",
        x: 450,
        y: 520,
        value: "and bump them back two rest stops!"
    },
    rules6: {
        type: "text",
        x: 450,
        y: 560,
        value: "Land right on the rest stop at position 50 to win!"
    },
    whatIsYourNameText: {
        type: "text",
        x: 450,
        y: 200,
        value: "Type your name then press Enter"
    },
    whatIsYourNameInputBox: {
        type: "rectangle",
        x: 300,
        y: 300,
        width: 300,
        height: 80,
    },
    whatIsYourNameUserInput: {
        type: "text",
        x: 450,
        y: 350,
        value: ""
    },
    welcomeMessageRed: {
        type: "text",
        x: 450,
        y: 40,
        value: `Welcome! You will have the red car.`
    },
    welcomeMessageBlue: {
        type: "text",
        x: 450,
        y: 80,
        value: "The computer will have the blue car."
    },
    newGameMessageRed: {
        type: "text",
        x: 450,
        y: 120,
        value: "You will go first."
    },
    newGameMessageBlue: {
        type: "text",
        x: 450,
        y: 80,
        value: "The computer will go first."
    },
    nextTurnMessageHuman: {
        type: "text",
        x: 450,
        y: 80,
        value: "It is your turn."
    },
    nextTurnMessageComputer: {
        type: "text",
        x: 450,
        y: 80,
        value: "It is the computer's turn."
    },
    startTurnButton: {
        type: "rectangle",
        x: 300,
        y: 140,
        width: 300,
        height: 50,
        name: "Start Turn button",
        value: "Click to Continue",
        onClick: function() {
            canvas.removeEventListener("click", clickListenerCallback);
            gameVars.textAndButtonsToDraw.length = 0;
            window.requestAnimationFrame(drawScreen);
            return startTurn();
        }
    },
    turnButtons: [
        {
            type: "rectangle",
            x: 110,
            y: 20,
            width: 340,
            height: 50,
            name: "Equation",
            value: ""
        },
        {
            type: "rectangle",
            x: 110,
            y: 80,
            width: 680,
            height: 50,
            name: "Create Your Equation text",
            value: "Create Your Equation:"
        },
        {
            type: "rectangle",
            x: 110,
            y: 140,
            width: 50,
            height: 50,
            name: "First Number Button",
            value: -1,
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 170,
            y: 140,
            width: 50,
            height: 50,
            name: "Second Number Button",
            value: -1,
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 230,
            y: 140,
            width: 50,
            height: 50,
            name: "Third Number Button",
            value: -1,
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 290,
            y: 140,
            width: 50,
            height: 50,
            value: "+",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 350,
            y: 140,
            width: 50,
            height: 50,
            value: "-",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 410,
            y: 140,
            width: 50,
            height: 50,
            value: "*",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 470,
            y: 140,
            width: 50,
            height: 50,
            value: "/",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 530,
            y: 140,
            width: 50,
            height: 50,
            value: "(",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 590,
            y: 140,
            width: 50,
            height: 50,
            value: ")",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 650,
            y: 140,
            width: 50,
            height: 50,
            value: "=",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        },
        {
            type: "rectangle",
            x: 710,
            y: 140,
            width: 80,
            height: 50,
            value: "Clear",
            onClick: function(i) { handleEquationButtonClick(this, i) },
            clicked: false
        }
    ],
    equalsSignDisplay: {
        type: "rectangle",
        x: 450,
        y: 20,
        width: 50,
        height: 50,
        value: "="
    },
    answerInput: {
        type: "rectangle",
        x: 500,
        y: 20,
        width: 290,
        height: 50,
        value: ""
    },
    answerPrompt: {
        type: "rectangle",
        x: 110,
        y: 80,
        width: 680,
        height: 50,
        value: "Type your answer above and press Enter"
    },
    incorrectAnswer: {
        type: "rectangle",
        x: 110,
        y: 80,
        width: 680,
        height: 50,
        value: "Incorrect. Press Enter."
    },
    displayCorrectEquation: {
        type: "rectangle",
        x: 110,
        y: 140,
        width: 680,
        height: 50,
        value: ""
    },
    shortcutModifierDisplay: {
        type: "text",
        x: 450,
        y: 40,
        value: "Shortcut! Move ahead!"
    },
    landmarkModifierDisplay: {
        type: "text",
        x: 450,
        y: 40,
        value: "Reached a rest stop! Move ahead to next rest stop!"
    },
    bumpedBackModifierDisplay: {
        type: "text",
        x: 450,
        y: 80,
        value: "Landed on same spot as other player!"
    },
    successfulEndOfTurnMessage: {
        type: "text",
        x: 450,
        y: 120,
        value: "Press Enter to continue."
    },
    computerTurnRandomNumbersDisplay: {
        type: "text",
        x: 450,
        y: 40,
        value: ""
    },
    endGameTieMessage: {
        type: "text",
        x: 450,
        y: 40,
        value: "Both players tie!"
    },
    endGameHumanWins: {
        type: "text",
        x: 450,
        y: 40,
        value: "You win!"
    },
    endGameComputerWins: {
        type: "text",
        x: 450,
        y: 40,
        value: "The computer wins!"
    },
    endGameNewGameButton: {
        type: "rectangle",
        x: 350,
        y: 140,
        width: 200,
        height: 50,
        value: "New Game",
        onClick: function() {
            canvas.removeEventListener("click", clickListenerCallback);
            gameVars.textAndButtonsToDraw.length = 0;
            window.requestAnimationFrame(drawScreen);
            return initializeGame();
        }
    },
}