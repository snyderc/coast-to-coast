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
    splashScreen: {
        type: "image",
        x: 0,
        y: 0,
        width: 900,
        height: 680,
        url: '/images/splash-screen.png',
        onClick: function() {
            canvas.removeEventListener("click", clickListenerCallback);
            gameVars.textAndButtonsToDraw.length = 0;
            window.requestAnimationFrame(drawScreen);
            return showRules();
        }
    },
    rulesScreen: {
        type: "image",
        x: 0,
        y: 0,
        width: 900,
        height: 680,
        url: '/images/rules.png',
        onClick: function() {
            canvas.removeEventListener("click", clickListenerCallback);
            gameVars.textAndButtonsToDraw.length = 0;
            window.requestAnimationFrame(drawScreen);
            return initializeGame();
        }
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