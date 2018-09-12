// PEMDAS Parser

function pemdas(arrayExpression) {
    const firstNumFunction = (arrayExpression, i) => {
        return ({
          value: parseFloat(arrayExpression[i]),
          index: i
        })
    }
    const secondNumFunction = (arrayExpression, i) => {
        // If the "second num" is actually a minus sign, treat it as
        // a negative of the following number
        if (arrayExpression[i+2] === "-") {
          return ({
            value: parseFloat(0-arrayExpression[i+3]),
            index: i+3
          })
        }
        else {
          return ({
            value: parseFloat(arrayExpression[i+2]),
            index: i+2
          });
        }
    }
    const resultFunction = (firstNum, secondNum, sign) => {
        if (sign === "+") {
          return firstNum.value + secondNum.value;
        }
        else if (sign === "-") {
          return firstNum.value - secondNum.value;
        }
        else if (sign === "*") {
          return firstNum.value * secondNum.value;
        }
        else if(sign === "/") {
          return firstNum.value / secondNum.value;
        }
    }
    const getValues = (arrayExpression, i) => {
        let firstNum = firstNumFunction(arrayExpression, i);
        let secondNum = secondNumFunction(arrayExpression, i);
        let sign = arrayExpression[i+1];
        // firstNum and secondNum values must be run through parseFloat()
        // before going into result.
        // I do this in firstNumFunction() and secondNumFunction()
        let result = resultFunction(firstNum, secondNum, sign);
        return ( {
          firstNum: firstNum,
          secondNum: secondNum,
          result: result
        })
    }
    const spliceArray = (arrayExpression, i) => {
        let values = getValues(arrayExpression, i)
        // console.log(values);
        // Splice the array accordingly
        // console.log(values.result);
        arrayExpression.splice(values.firstNum.index, values.secondNum.index-values.firstNum.index+1, values.result);
        // console.log(arrayExpression);
    }
    const pemdasParser = (arrayExpression) => {
        // If parentheses, get indices and run pemdasParser() on the subarray
        // Then replace parentheses with value
        // This code assumes only one set of parentheses!
        // For multiple sets, implement a stack to find the right indices for "(" and ")"
        if (arrayExpression.indexOf("(") > -1) {
          const openParenthesisIndex = arrayExpression.indexOf("(");
          const closeParenthesisIndex = arrayExpression.indexOf(")");
          const subArray = arrayExpression.slice(openParenthesisIndex+1, closeParenthesisIndex);
          let parenthesisEval = pemdasParser(subArray);
          arrayExpression.splice(openParenthesisIndex, closeParenthesisIndex-openParenthesisIndex+1, parenthesisEval);
        }
      
        // Handle multiplication and division
        for (let i = 0; i < arrayExpression.length-1; i++) {
          // Look ahead to see if a * or / are upcoming
          while (arrayExpression[i+1] === "*" || arrayExpression[i+1] === '/') {
            spliceArray(arrayExpression, i)
          }
        }
      
        // Handle addition and subtraction
        while(arrayExpression.length > 1) {
          spliceArray(arrayExpression, 0)
        }
      
        // Return result, which should be a number by now
        // Also empties the array so the programmer knows what to expect from it
        // console.log(typeof arrayExpression[0])
        // console.log(arrayExpression[0]);
        const finalResult = arrayExpression[0];
        arrayExpression.length = 0;
        return finalResult;
    }
    return pemdasParser(arrayExpression);
}

// Load Images

const imageUrls = [
    '/images/car-left-blue.png',
    '/images/car-left-red.png',
    '/images/car-right-blue.png',
    '/images/car-right-red.png',
    '/images/house.png',
    '/images/road-piece.png',
    '/images/road-rest-stop.png'
];

// Initialize coordinates of where to draw cars for each position
function initializeCarCoords() {
    // Rest stops
    for (let i = 0; i < 6; i++) {
        const key = i*10;
        const baseX = 10;
        const oddXOffset = 800;
        const yOffset = 80;
        const baseY = 200;
        const blueCarYOffset = 30;
        // Positions 0, 20, 40
        if (i % 2 === 0) {
            dictOfCarCoords[key] = {
                redCar: {
                    x: baseX,
                    y: baseY+(i*yOffset)
                },
                blueCar: {
                    x: baseX,
                    y: baseY+blueCarYOffset+(i*yOffset)
                }
            }
        }
        // Positions 10, 30, 50
        else {
            dictOfCarCoords[key] = {
                redCar: {
                    x: baseX+oddXOffset,
                    y: baseY+(i*yOffset)
                },
                blueCar: {
                    x: baseX+oddXOffset,
                    y: baseY+blueCarYOffset+(i*yOffset)
                }
            }
        }

    }

    // Rows
    for (let row = 0; row < 5; row++) {
        // Zero and even rows go left to right (1-9, 21-29, 41-49)
        const rowYCoordBase = 228;
        const rowYOffset = 80;
        const rowYCoord = rowYCoordBase + rowYOffset * row;
        if (row % 2 === 0) {
            for (let col = 0; col < 9; col++) {
                const colXCoordBase = 90;
                const colXCoordOffset = 80;
                const key = (row * 10) + (col + 1);
                dictOfCarCoords[key] = {
                    all: {
                        x: colXCoordBase + colXCoordOffset * col,
                        y: rowYCoord
                    }
                }
            }
        }
        // Odd rows go right to left (11-19, 31-39)
        else {
            const colStart = 9;
            for (let col = 8; col >= 0; col--) {
                const colXCoordBase = 90;
                const colXCoordOffset = 80;
                const key = (row * 10) + (colStart - col);
                dictOfCarCoords[key] = {
                    all: {
                        x: colXCoordBase + colXCoordOffset * col,
                        y: rowYCoord
                    }
                }
            }
        }
    }
}

// Image preloader from https://stackoverflow.com/questions/17480115/a-function-to-preload-images-need-to-draw-them-now-but-how
function loadImages(imageUrlArray, imageLoadedArray, callback) {
    var loadedImageCount = 0;
    for (let i = 0; i < imageUrlArray.length; i++) {
        var img = new Image();
        img.onload = imageLoaded;
        img.src = imageUrlArray[i];
        imageLoadedArray[imageUrlArray[i]] = img;
    }
    function imageLoaded(e) {
        loadedImageCount++;
        if (loadedImageCount >= imageUrlArray.length) {
            callback();
        }
    }
}

// Draw Elements on Screen

function drawRectangle(rect) {
    // rect.clicked means it's disabled and shows as all black (mostly for the equation buttons)
    if (rect.clicked) {
        ctx.fillStyle = 'black';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    // otherwise, output as normal
    else {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        // If button has a label, draw the text label too
        if (rect.value) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            if (ctx.textAlign === "left") {
                ctx.fillText(rect.value, rect.x, rect.y+((32/50)*rect.height));
            }
            else if (ctx.textAlign === "center") {
                ctx.fillText(rect.value, rect.x+(rect.width/2), rect.y+((32/50)*rect.height));
            }
        }
    }
}

function drawText(text) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(text.value, text.x, text.y);
}

function drawTextDisplayArea() {
    ctx.strokeStyle = "black";
    ctx.strokeRect(100, 10, 700, 190);

    // ctx.font = "30px Arial";
    // ctx.fillStyle = "black";
    // ctx.textAlign="center";
    // ctx.fillText("Coast to Coast", 450, 40);
}

function drawRestStops() {
    const restStopTileXBase = 10;
    const restStopTileYBase = 160;
    const restStopHouseXBase = restStopTileXBase;
    const restStopHouseYBase = restStopTileYBase-30;
    const restStopYOffset = 80;
    const oddRestStopXOffset = 800;

    const textXOffset = 40;
    const textYOffset = 115;

    for (let i = 0; i < 6; i++) {
        // Rest stops at 0, 20, 40
        if (i % 2 === 0) {
            ctx.drawImage(images['/images/road-rest-stop.png'], restStopTileXBase, restStopTileYBase+(i*restStopYOffset));
            ctx.drawImage(images['/images/house.png'], restStopHouseXBase, restStopHouseYBase+(i*restStopYOffset));
            ctx.font = "18px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            const textToDisplay = i*10;
            ctx.fillText(textToDisplay, restStopTileXBase+textXOffset, restStopTileYBase+(i*restStopYOffset)+textYOffset);
        }
        // Rest stops at 10, 30, 50
        else {
            ctx.drawImage(images['/images/road-rest-stop.png'], restStopTileXBase+oddRestStopXOffset, restStopTileYBase+(i*restStopYOffset));
            ctx.drawImage(images['/images/house.png'], restStopHouseXBase+oddRestStopXOffset, restStopHouseYBase+(i*restStopYOffset));
            ctx.font = "18px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            const textToDisplay = i*10;
            ctx.fillText(textToDisplay, restStopTileXBase+oddRestStopXOffset+textXOffset, restStopTileYBase+(i*restStopYOffset)+textYOffset);
        }
    }
}

function drawRoadTiles() {
    // First row piece is at (90, 240)
    // 9 row pieces across: increment x by 80 pixels per each piece
    // 5 rows down: increment y by 80 pixels per each row
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 9; col++) {
            ctx.drawImage(images['/images/road-piece.png'], 90+(col*80), 240+(row*80));
        }
    }

    // Write the number on each road piece
    for (let row = 0; row < 5; row++) {
        // Zero and even rows go left to right (1-9, 21-29, 41-49)
        const rowYCoordBase = 240;
        const rowYOffset = 80;
        const rowYCoord = rowYCoordBase + rowYOffset * row;
        if (row % 2 === 0) {
            for (let col = 0; col < 9; col++) {
                const colXCoordBase = 90;
                const colXCoordOffset = 80;
                const key = (row * 10) + (col + 1);
                // Align the position # centered (x pos of road + 40) and offset 35 from the top of the tile
                ctx.font = "18px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(key, colXCoordBase+(colXCoordOffset*col)+40, rowYCoord+35);
            }
        }
        // Odd rows go right to left (11-19, 31-39)
        else {
            const colStart = 9;
            for (let col = 8; col >= 0; col--) {
                const colXCoordBase = 90;
                const colXCoordOffset = 80;
                const key = (row * 10) + (colStart - col);
                // Align the position # centered (x pos of road + 40) and offset 35 from the top of the tile
                ctx.font = "18px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(key, colXCoordBase+(colXCoordOffset*col)+40, rowYCoord+35);
            }
        }
    }
}

// TODO:
// Make more visually appealing
// Dynamically draw shortcuts based on values in gameVars array
function drawShortcuts() {
    ctx.strokeStyle = "black";
    // 5 to 14 shortcut
    ctx.beginPath();
    ctx.moveTo(453, 274);
    ctx.lineTo(535, 327);
    ctx.stroke();

    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.fillText("Shortcut", 490, 300);

    // 26 to 35 shortcut
    ctx.beginPath();
    ctx.moveTo(533, 434);
    ctx.lineTo(453, 486);
    ctx.stroke();

    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.fillText("Shortcut", 490, 460);
}

function drawCars() {
    // Player 1 is the Red Car and Player 2 is the Blue Car
    // Draw the cars in the proper direction, at the coordinates in the object
    const carRightRed = '/images/car-right-red.png';
    const carLeftRed = '/images/car-left-red.png';
    const carRightBlue = '/images/car-right-blue.png';
    const carLeftBlue = '/images/car-left-blue.png';

    if (gameVars.carPositions.redCar.dir === 'right') {
        ctx.drawImage(images[carRightRed], gameVars.carPositions.redCar.x, gameVars.carPositions.redCar.y);
    }
    else if (gameVars.carPositions.redCar.dir == 'left') {
        ctx.drawImage(images[carLeftRed], gameVars.carPositions.redCar.x, gameVars.carPositions.redCar.y);
    }
    if (gameVars.carPositions.blueCar.dir === 'right') {
        ctx.drawImage(images[carRightBlue], gameVars.carPositions.blueCar.x, gameVars.carPositions.blueCar.y);
    }
    else if (gameVars.carPositions.blueCar.dir === 'left') {
        ctx.drawImage(images[carLeftBlue], gameVars.carPositions.blueCar.x, gameVars.carPositions.blueCar.y);
    }
}

function drawBoard() {
    drawRestStops();
    drawRoadTiles();
    drawShortcuts();
    drawCars();
}

function drawScreen() {
    // Clear screen first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If during game, then draw the Board (game pieces, cars, etc.) and Text Display Area (backdrop)
    if (!gameVars.pregame) {
        drawTextDisplayArea();
        drawBoard();
    }

    // Draw everything in textAndButtonsToDraw array
    for (let i = 0; i < gameVars.textAndButtonsToDraw.length; i++) {
        if (gameVars.textAndButtonsToDraw[i].type === "text") {
            drawText(gameVars.textAndButtonsToDraw[i]);
        }
        else if (gameVars.textAndButtonsToDraw[i].type === "rectangle") {
            drawRectangle(gameVars.textAndButtonsToDraw[i]);
        }
    }
}

// Calculates the X/Y coordinate of the mouse click inside the canvas
// based on the event's X/Y coordinate (relative to window)
// and the offset of the canvas from window's (0,0)
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    // console.log(event.clientX, event.clientY);
    // console.log(rect);
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
};

// Calculates whether a given position is inside a given rectangle
function isInside(pos, rect) {
    // console.log(pos, rect);
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
};

function clickListenerCallback(event) {
    event.stopImmediatePropagation(); // Makes sure a canvas click doesn't also register as a window click (a "double click")
    var mousePos = getMousePos(canvas, event);
    for (let i = 0; i < gameVars.textAndButtonsToDraw.length; i++) {
        if (isInside(mousePos, gameVars.textAndButtonsToDraw[i])) {
            if (gameVars.textAndButtonsToDraw[i].onClick) {
                // Once a matching button has been found, the for loop terminates due to return statement
                return gameVars.textAndButtonsToDraw[i].onClick(i);
            }
        }
    }
};

function keydownListenerCallback(event, objectToUpdate, acceptedInputs, maxLength, ifEnterPressed) {
    event.preventDefault(); // So spacebar doesn't make window scroll down
    const keyLowerCase = event.key.toLowerCase();
    // console.log(keyLowerCase);
    if (event.code === "Backspace") {
        objectToUpdate.value = objectToUpdate.value.substr(0, objectToUpdate.value.length-1);
    }
    else if (event.code === "Enter") {
        ifEnterPressed(objectToUpdate.value);
    }
    else if (objectToUpdate.value.length < maxLength) {
        // Can also do regex: /[a-z0-9]/i.test(event.key) or /[a-z]/i.test(event.key)
        if (keyLowerCase >= "a" && keyLowerCase <= "z" && keyLowerCase.length === 1) {
            if (acceptedInputs === "letters") {
                objectToUpdate.value += event.key;
            }
        }
        else if (keyLowerCase === "-" || (keyLowerCase >= "0" && keyLowerCase <= "9" && keyLowerCase.length === 1)) {
            if (acceptedInputs === "numbers") {
                objectToUpdate.value += event.key.toString();
            }
        }
    }
    // Update screen with modified text input
    window.requestAnimationFrame(drawScreen);
}

function addToEntryStack(value, entryStack, button) {
    // If button is already clicked, don't let it be clicked again!
    if (button.clicked) {
        return "invalidButton";
    }
    if (value === "Clear") {
        entryStack.length = 0;
        // Make all the buttons clickable again
        for (let i = 0; i < messages.turnButtons.length; i++) {
            if (messages.turnButtons[i].clicked) {
                messages.turnButtons[i].clicked = false;
            }
        }
        //TODO: Implement backspace instead of clear
    }
    // do a math operation using the simple-PEMDAS-parser
    // set the screen to the result of the math operations
    else if (value === "=") {
        // If not all three numbers are clicked yet, don't recognize the = sign as valid
        if (!messages.turnButtons[2].clicked || !messages.turnButtons[3].clicked || !messages.turnButtons[4].clicked) {
            return "invalidEqualsSign";
        }
        if (entryStack.length > 0) {
            // Last item in array must be a number 0-9 or a close paren
            while (!entryStack[entryStack.length-1].match(/[0-9]|\)/)) {
                entryStack.pop();
        }
        return "validEqualsSign";
        }
    }
    // If nothing in stack and "0" was clicked, do nothing
    else if (entryStack.length === 0 && value === "0") {
        // do nothing
    }
    else {
        // check to make sure it's valid to add to the stack
        // note: PEMDAS parser takes care of the "-" in "3 * -3" or "-3 * 3"
        // if it's a +, *, / -- it must come after a number
        if (value.match(/[+|*|\/]/)) {
        // if stack length > 0 and stack[length-1] is digit 0-9 or a close paren, add value to stack
        if (entryStack.length > 0 && entryStack[entryStack.length-1].match(/[0-9]|\)/)) {
            entryStack.push(value);
            button.clicked = true;
        }
        }
        // Minus sign can go anywhere in the expression
        else if (value === "-") {
        entryStack.push(value);
        button.clicked = true;
        }
        else if (value.match(/[0-9]/)) {
        // If comes after ), add a * on the stack, then add the value
        if (entryStack.length > 0 && entryStack[entryStack.length-1] === ")") {
            entryStack.push("*");
            entryStack.push(value);
            button.clicked = true;
        }
        // If nothing in stack, or comes after a + - * / or open paren, then add to stack
        else if (entryStack.length === 0 || entryStack[entryStack.length-1].match(/[+|\-|*|\/|\(]/)) {
            entryStack.push(value);
            button.clicked = true;
        }
        }
        else if (value === "(") {
        // If first on the stack, add it
        if (entryStack.length === 0) {
            entryStack.push(value);
            button.clicked = true;
        }
        // If comes after an 0-9, add a * then add to stack
        else if (entryStack.length > 0 && entryStack[entryStack.length-1].match(/[0-9]/)) {
            entryStack.push("*");
            entryStack.push(value);
            button.clicked = true;
        }
        // If comes after + - * /, add to stack
        else if (entryStack.length > 0 || entryStack[entryStack.length-1].match(/[+|\-|*|\/]/)) {
            entryStack.push(value);
            button.clicked = true;
        }
        }
        else if (value === ")") {
        // Must come after a number
        if (entryStack.length > 0 && entryStack[entryStack.length-1].match(/[0-9]/)) {
            entryStack.push(value);
            button.clicked = true;
        }
        }
        // if it's a number 0-9, it must come after a + - * /
        // --> it can also be the first item on the stack
        // --> if it comes after a ), add a * into the stack
        // if left paren, it must come after a + - * /
        // --> if it comes after a number, add a * into the stack
        // --> it can also be the first on the stack
        // if right paren, it must come after a number
    }
    return "validButton";
}

// TODO: Determine whether you need the click listener to pass "i" (the position of the button in the text/button array)
// You don't need it in handleEquationButtonClick. Do you need it elsewhere?
function handleEquationButtonClick(button, i) {
    const result = addToEntryStack(button.value, gameVars.turnEntryStack, button);
    if (result === "validEqualsSign") {
        // Set all buttons back to "clicked = true". First two items are not buttons so start at i=2.
        for (let i = 2; i < messages.turnButtons.length; i++) {
            messages.turnButtons[i].clicked = false;
        }
        return showAnswerPrompt();
    }
    else {
        messages.turnButtons[0].value = gameVars.turnEntryStack.reduce((accum, curVal) => {
            accum += curVal;
            return accum;
        }, "");
        window.requestAnimationFrame(drawScreen);
    }
}

function showAnswerPrompt() {
    gameVars.textAndButtonsToDraw.length = 0;                       // Clear Text Display Area
    gameVars.textAndButtonsToDraw.push(messages.turnButtons[0]);    // Shows the equation entered by the user
    gameVars.textAndButtonsToDraw.push(messages.equalsSignDisplay);
    gameVars.textAndButtonsToDraw.push(messages.answerInput);
    gameVars.textAndButtonsToDraw.push(messages.answerPrompt);
    window.requestAnimationFrame(drawScreen);
    window.addEventListener("keydown", function _answerInputProcessor(event) {
        keydownListenerCallback(event, messages.answerInput, "numbers", 3, function() {
            // Handler for when "Enter" key pressed
            gameVars.textAndButtonsToDraw.length = 0;
            window.removeEventListener("keydown", _answerInputProcessor);
            // Call PEMDAS parser to determine if you're correct
            const calculatedResult = pemdas(gameVars.turnEntryStack.slice(0, gameVars.turnEntryStack.length));
            // console.log(gameVars.turnEntryStack);
            messages.displayCorrectEquation.value = `${messages.turnButtons[0].value} = ${calculatedResult}`;
            if (calculatedResult === parseInt(messages.answerInput.value)) {
                // Show how the computer AI would have answered. TODO: Display on screen.
                console.log("Computer's suggested move: ", runComputerAi(gameVars.turnRandomNumbers, gameVars.currentPlayer.score, gameVars.otherPlayer.score));
                // Send equation as string, and answer, to move processer
                return processMove(messages.turnButtons[0].value, calculatedResult);
            }
            else {
                gameVars.textAndButtonsToDraw.push(messages.turnButtons[0]);
                gameVars.textAndButtonsToDraw.push(messages.equalsSignDisplay);
                gameVars.textAndButtonsToDraw.push(messages.answerInput);
                gameVars.textAndButtonsToDraw.push(messages.incorrectAnswer);
                gameVars.textAndButtonsToDraw.push(messages.displayCorrectEquation);
                window.addEventListener("keydown", endTurn);
            }
        });
    });
}

// Calculates move outcome based on current positions of players and answer to the player's equation
function getMoveOutcome(currentPlayerInitialScore, otherPlayerInitialScore, currentPlayerAnswer) {
    const moveOutcome = {
        curPlayerOriginalPos: currentPlayerInitialScore,
        otherPlayerOriginalPos: otherPlayerInitialScore,
        doesCurPlayerMove: true,
        curPlayerPositionAfterMath: currentPlayerInitialScore + currentPlayerAnswer,
        curPlayerTypeOfModifier: "none",
        curPlayerFinalPosAfterModifier: currentPlayerInitialScore + currentPlayerAnswer,
        isOtherPlayerDisplaced: false,
        otherPlayerFinalPos: otherPlayerInitialScore
    }
    // Calculate player position after math
    if (currentPlayerAnswer === 0) {
        // Don't move
        moveOutcome.doesCurPlayerMove = false;
        moveOutcome.curPlayerPositionAfterMath = moveOutcome.curPlayerOriginalPos;
        moveOutcome.curPlayerFinalPosAfterModifier = moveOutcome.curPlayerOriginalPos;
        return moveOutcome;
    }
    const playerPosAfterMath = moveOutcome.curPlayerOriginalPos + currentPlayerAnswer
    if (playerPosAfterMath < 0 || playerPosAfterMath > 50) {
        // Don't move -- would go off board otherwise
        moveOutcome.doesCurPlayerMove = false;
        moveOutcome.curPlayerPositionAfterMath = moveOutcome.curPlayerOriginalPos;
        moveOutcome.curPlayerFinalPosAfterModifier = moveOutcome.curPlayerOriginalPos;
        return moveOutcome;
    }
    else {
        // Update position based on the equation's answer
        moveOutcome.curPlayerPositionAfterMath = playerPosAfterMath;
        // Update for modifiers (landmark and shortcut modifiers are exclusive b/c shortcuts don't go to/from landmarks)
        // Landmark modifier
        if (gameVars.landmarks.indexOf(moveOutcome.curPlayerPositionAfterMath) > -1) {
            moveOutcome.curPlayerTypeOfModifier = "landmark";
            moveOutcome.curPlayerFinalPosAfterModifier = moveOutcome.curPlayerPositionAfterMath + 10;
        }
        // Shortcut modifier, or no modifier at all
        else {
            if (moveOutcome.curPlayerPositionAfterMath === 5) {
                moveOutcome.curPlayerTypeOfModifier = "shortcut";
                moveOutcome.curPlayerFinalPosAfterModifier = 14;
            }
            else if (moveOutcome.curPlayerPositionAfterMath === 26) {
                moveOutcome.curPlayerTypeOfModifier = "shortcut";
                moveOutcome.curPlayerFinalPosAfterModifier = 35;
            }
            else {
                curPlayerFinalPosAfterModifier = moveOutcome.curPlayerPositionAfterMath;
            }
        }
        // Update if other player is displaced
        if (moveOutcome.curPlayerFinalPosAfterModifier === moveOutcome.otherPlayerOriginalPos) {
            const index = gameVars.landmarks.indexOf(moveOutcome.otherPlayerOriginalPos);
            // If not at landmark, send other player back! (Can't displace if at landmark)
            if (index < 0) {
                // Other player gets sent back 2 landmarks
                const proposedOtherPosition = moveOutcome.otherPlayerOriginalPos - moveOutcome.otherPlayerOriginalPos%10 - 10;
                moveOutcome.otherPlayerFinalPos = proposedOtherPosition > 0 ? proposedOtherPosition : 0;
                moveOutcome.isOtherPlayerDisplaced = true
            }
        }
    }
    return moveOutcome;
}

function moveCar(carName, currentPosition, futurePosition, modifier = "none") {
    setFuturePositions(carName, currentPosition, futurePosition, modifier);
    // console.log(gameVars.carPositions.redCar.futurePositions);
    const currentCar = gameVars.carPositions[carName];
    return new Promise(function(resolve,reject) {
        function step() {
            // console.log(currentCar.futurePositions);
            // console.log(currentCar.futurePositions.length);
            // Test to make sure there are any future positions to move to
            if (currentCar.futurePositions.length > 0) {
                const intervalPerFrame = 2; // Approximate number of pixels to travel in straight line
                const carXEndPosition = currentCar.futurePositions[0].x;
                const carYEndPosition = currentCar.futurePositions[0].y;
                const distanceToTravel = {
                    x: carXEndPosition - currentCar.x,
                    y: carYEndPosition - currentCar.y
                }
                // console.log(distanceToTravel.x, distanceToTravel.y);
                // Check to make sure car isn't already in that position
                if (distanceToTravel.x != 0 || distanceToTravel.y != 0) {
                    // Calculates frame change in X and Y directions based on straight line intervalPerFrame
                    const ratioOfChange = distanceToTravel.y / distanceToTravel.x;
                    let frameChangeX = Math.sqrt(Math.pow(intervalPerFrame, 2) / (1 + Math.pow(ratioOfChange, 2)));
                    if (distanceToTravel.x < 0) {
                        frameChangeX *= -1;
                        currentCar.dir = 'left';
                    }
                    else if (distanceToTravel.x > 0) {
                        currentCar.dir = 'right';
                    }
                    let frameChangeY = Math.abs(ratioOfChange * frameChangeX);
                    if (distanceToTravel.y < 0) {
                        frameChangeY *= -1;
                    }
                    // console.log("frameChange", frameChangeX, frameChangeY);
                    currentCar.x += Math.round(frameChangeX);
                    currentCar.y += Math.round(frameChangeY);
                    drawScreen();
                    window.requestAnimationFrame(step);
                }
                else {
                    // If car already in that position, remove that position from the array
                    // and get ready to process the next array item.
                    // If no more positions for car to move to, resolves the promise.
                    currentCar.futurePositions.shift();
                    if (currentCar.futurePositions.length > 0) {
                        window.requestAnimationFrame(step);
                    }
                    else {
                        // console.log("I found the else statement! 2");
                        resolve();
                    }
                }
            }
            else {
                // console.log("I found the else statement! 1");
                resolve();
            }
        }
        window.requestAnimationFrame(step);
    });
}

function setFuturePositions(carName, currentPosition, futurePosition, modifier) {
    // If shortcut, only put currentPosition and futurePosition and no others in array
    // TODO: DRY this code
    if (modifier === "shortcut") {
        // Load current position into array
        gameVars.carPositions[carName].futurePositions.push(dictOfCarCoords[currentPosition].all);
        // Load future position into array
        gameVars.carPositions[carName].futurePositions.push(dictOfCarCoords[futurePosition].all);
        // console.log(dictOfCarCoords[currentPosition].all, dictOfCarCoords[futurePosition].all)
    }
    else if (currentPosition < futurePosition) {
        for (let i = currentPosition; i <= futurePosition; i++) {
            if (dictOfCarCoords[i].hasOwnProperty('all')) {
                gameVars.carPositions[carName].futurePositions.push(dictOfCarCoords[i].all);
            }
            else {
                gameVars.carPositions[carName].futurePositions.push(dictOfCarCoords[i][carName]);
            }
        }
    }
    else if (currentPosition > futurePosition) {
        for (let i = currentPosition; i >= futurePosition; i--) {
            if (dictOfCarCoords[i].hasOwnProperty('all')) {
                gameVars.carPositions[carName].futurePositions.push(dictOfCarCoords[i].all);
            }
            else {
                gameVars.carPositions[carName].futurePositions.push(dictOfCarCoords[i][carName]);
            }
        }
    }
}

function endTurn(event) {
    keydownListenerCallback(event, {value: 0}, undefined, 0, function() {
        window.removeEventListener("keydown", endTurn);
        gameVars.textAndButtonsToDraw.length = 0;
        // Clear value in the equation displayer
        messages.turnButtons[0].value = "";
        // Clear values in each turn button that display from the random numbers
        messages.turnButtons[2].value = -1;
        messages.turnButtons[3].value = -1;
        messages.turnButtons[4].value = -1;
        messages.displayCorrectEquation.value = ""
        messages.answerInput.value = "";
        window.requestAnimationFrame(drawScreen);
        return initializeTurn();
    });
}

// Takes in an array of three numbers (such as the three random numbers from gameVars).
// Returns the value most advantageous to the current player.

function runComputerAi(numbers, currentPlayerScore, otherPlayerScore) {
    const arrayOfResults = [];
    const arrayOfMath = [];
    const firstNum = numbers[0];
    const secondNum = numbers[1];
    const thirdNum = numbers[2];
    
    const arrayOfNums = [
      [firstNum, secondNum, thirdNum],
      [firstNum, thirdNum, secondNum],
      [secondNum, firstNum, thirdNum],
      [secondNum, thirdNum, firstNum],
      [thirdNum, firstNum, secondNum],
      [thirdNum, secondNum, firstNum]
    ]
    
    // TODO: There must be a better way to do this...
    // Also, I know that some of these equations are duplicates of each other
    // when a/b/c are switched around. I don't have a mathematical proof
    // to validate it, so I've left duplicates in for now.
    for (let i = 0; i < arrayOfNums.length; i++) {
      const a = arrayOfNums[i][0];
      const b = arrayOfNums[i][1];
      const c = arrayOfNums[i][2];
    
      arrayOfResults.push(a+b-c);
      arrayOfResults.push(a+b*c);
      arrayOfResults.push(a+b/c);
      arrayOfResults.push((a+b)*c);
      arrayOfResults.push((a+b)/c);
      arrayOfResults.push(a-b+c);
      arrayOfResults.push(a-b*c);
      arrayOfResults.push(a-b/c);
      arrayOfResults.push((a-b)*c);
      arrayOfResults.push((a-b)/c);
      arrayOfResults.push(a*b+c);
      arrayOfResults.push(a*b-c);
      arrayOfResults.push(a*b/c);
      arrayOfResults.push(a*(b+c));
      arrayOfResults.push(a*(b-c));
      arrayOfResults.push(a/b+c);
      arrayOfResults.push(a/b-c);
      arrayOfResults.push(a/b*c);
      arrayOfResults.push(a/(b+c));
      arrayOfResults.push(a/(b-c));
    
      arrayOfMath.push({
        formula: `${a}+${b}-${c}`,
        result: a+b-c
      });
      arrayOfMath.push({
        formula: `${a}+${b}*${c}`,
        result: a+b*c
      });
      arrayOfMath.push({
        formula: `${a}+${b}/${c}`,
        result: a+b/c
      });
      arrayOfMath.push({
        formula: `(${a}+${b})*${c}`,
        result: (a+b)*c
      });
      arrayOfMath.push({
        formula: `(${a}+${b})/${c}`,
        result: (a+b)/c
      });
      arrayOfMath.push({
        formula: `${a}-${b}+${c}`,
        result: a-b+c
      });
      arrayOfMath.push({
        formula: `${a}-${b}*${c}`,
        result: a-b*c
      });
      arrayOfMath.push({
        formula: `${a}-${b}/${c}`,
        result: a-b/c
      });
      arrayOfMath.push({
        formula: `(${a}-${b})*${c}`,
        result: (a-b)*c
      });
      arrayOfMath.push({
        formula: `(${a}-${b})/${c}`,
        result: (a-b)/c
      });
      arrayOfMath.push({
        formula: `${a}*${b}+${c}`,
        result: a*b+c
      });
      arrayOfMath.push({
        formula: `${a}*${b}-${c}`,
        result: a*b-c
      });
      arrayOfMath.push({
        formula: `${a}*${b}/${c}`,
        result: a*b/c
      });
      arrayOfMath.push({
        formula: `${a}*(${b}+${c})`,
        result: a*(b+c)
      });
      arrayOfMath.push({
        formula: `${a}*(${b}-${c})`,
        result: a*(b-c)
      });
      arrayOfMath.push({
        formula: `${a}/${b}+${c}`,
        result: a/b+c
      });
      arrayOfMath.push({
        formula: `${a}/${b}-${c}`,
        result: a/b-c
      });
      arrayOfMath.push({
        formula: `${a}/${b}*${c}`,
        result: a/b*c
      });
      arrayOfMath.push({
        formula: `${a}/(${b}+${c})`,
        result: a/(b+c)
      });
      arrayOfMath.push({
        formula: `${a}/(${b}-${c})`,
        result: a/(b-c)
      });
    }
    
    const finalArrayOfResults = arrayOfResults
      .filter( (item) => Math.floor(item) === item )
      .filter( (item) => isFinite(item))
      .sort((a, b) => b - a)
      .filter( (item, index, array) => {
        return !index || item != array[index-1];
      })
    
    // Filter duplicates information
    // from https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    
    // console.log(arrayOfResults);
    // console.log(finalArrayOfResults);
    
    // Now that you have the final array of results, map the outcomes
    // Then if anything equals 50, choose that
    // Else, map again to just get the deltas of (currentPlayer score - otherPlayer score)
    // And choose the one with the highest delta
    
    const finalArrayOutcomes = finalArrayOfResults.map( (item) => {
      return getMoveOutcome(currentPlayerScore, otherPlayerScore, item)
    });
    
    // console.log('final array outcomes', finalArrayOutcomes);
    
    // If anything equals 50, return just that one
    // Note: You could also do this as a reduce and return the object
    const finalArrayMaybeFifty = finalArrayOutcomes.filter( (item) => {
      return item.curPlayerFinalPosAfterModifier === 50;
    });
    
    // console.log('final array maybe 50', finalArrayMaybeFifty);
    
    if (finalArrayMaybeFifty.length > 0) {
      // process the info in that array -- this is the move you want
    //   console.log("You've found the move you want to make! It gets you to 50!");
      // return finalArrayMaybeFifty;
    //   console.log(finalArrayMaybeFifty[0].newPositionModifier);
      // This reduce array is the same as the one in the else statement
      // TODO: Consolidate
    //   console.log(arrayOfMath);
      const formulaForMove = arrayOfMath.reduce( (accum, curVal) => {
        // Match the result to the delta between original position and position after the math equation only
        if (curVal.result === finalArrayMaybeFifty[0].curPlayerPositionAfterMath - finalArrayMaybeFifty[0].curPlayerOriginalPos) {
          return curVal;
        }
        else {
          return accum;
        }
      }, {});
    //   console.log(formulaForMove);
      return {
        desiredMove: finalArrayMaybeFifty[0],
        formulaForMove
      };
    }
    else {
      // reduce the array -- compare each delta
      // and only return the object with the largest delta
      // comparing currentPlayerNewScore and otherPlayerNewScore
      const desiredMove = finalArrayOutcomes.reduce( (accum, curVal) => {
        const curValDelta = curVal.curPlayerFinalPosAfterModifier - curVal.otherPlayerFinalPos;
        const accumDelta = accum.curPlayerFinalPosAfterModifier - accum.otherPlayerFinalPos;
        if (curValDelta > accumDelta) {
          return curVal;
        }
        else {
          return accum;
        }
      });
      // return desiredMove;
    //   console.log(desiredMove);
      // This reduce function will only return one object.
      // It's possible that multiple formulas equal newPositionModifier
      // in which case this function will return the object in the arrayOfMath
      // that's closest to the end of the array.
      const formulaForMove = arrayOfMath.reduce( (accum, curVal) => {
        // Find the result that matches the delta between the original position and the position after only the math equation
        if (curVal.result === desiredMove.curPlayerPositionAfterMath - desiredMove.curPlayerOriginalPos) {
          return curVal;
        }
        else {
          return accum;
        }
      });
    //   console.log(formulaForMove);
      return {
        desiredMove,
        formulaForMove
      }
    }
  }