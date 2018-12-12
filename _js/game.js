/**************************************************************
 * ************************************************************
 *  VARIABLES FOR THE GAME*************************************
 * ************************************************************
 **************************************************************/

 // Start the canvas stage, set with and height
const stage = new createjs.Stage("testCanvas");
createjs.Ticker.addEventListener("tick", stage);
stage.width = 800;
stage.height = 800;

// Font Faces & Sizes 
const fontFace = 'Cinzel Decorative';
const fontFaceNumbers = 'Cinzel';
const fontSizeButton = '22px';
const fontSizeMessage = '20px';
const fontSizeNumbers = '24px';

// Message / Number Colours 
const messageColor = '#fff';
const numberColor = '#fff';

/****************************************************
 * Board Variables                                  *
 ***************************************************/
const size = 70;
const spacing = 70;
const total = 29; // Starts from 0 = 30
var space = [];

// Layout,  Top-Horizontal - Right-Vertical - Bottom-Horizontal - Left_Vertical)
const layout = [8, 15, 23, 30];

// Start X & Y
var x = 15;
var y = 100;

/****************************************************
 * Player / Dice Variables                          *
 ***************************************************/
var playerTurn = 0;
let doubles = 0;

/****************************************************
 * Player Object, store all data for player         *
 ***************************************************/
var player = [
            {character : "", name : "Player 1", num : '1', color : "#febc2c", x : -100, y : -100, dice : 0, marginX : 12, marginY : 13}, 
            {character : "", name : "Player 2", num : '2', color : "#2badff", x : -100, y : -100, dice : 0, marginX : 17, marginY : 7}
        ];

/****************************************************
 * Check Session Storage if Players are chosen      *
 ***************************************************/
if( sessionStorage.getItem('player1') && sessionStorage.getItem('player2')){
    player[0].number = sessionStorage.getItem('player1');
    player[1].number = sessionStorage.getItem('player2')
    player[0].character = sessionStorage.getItem('player1Name');
    player[1].character = sessionStorage.getItem('player2Name');

    // Add Player1 to the screen
    document.getElementById('player1').innerHTML += `
    <div class="card text-center">
    <div class="card-body">
        <h5 class="card-title text-center">`+ player[0].name + `</h5>
        <span style="display: block; background-color: ` + player[0].color + `; width: 100%; height: 25px;">` + player[0].character + `</span>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ player[0].number + `.png" alt="Card image" style="max-height: 100px; max-width: 100px;">
        
    </div>
        
    </div> <!-- card -->
    `;

    // Add Player2 to the screen
    document.getElementById('player2').innerHTML += `
    <div class="card text-center">
    <div class="card-body">
        <h5 class="card-title text-center">`+ player[1].name + `</h5>
        <span style="display: block; background-color: ` + player[1].color + `; width: 100%; height: 25px;">` + player[1].character + `</span>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ player[1].number + `.png" alt="Card image" style="max-height: 100px; max-width: 100px;">
    </div>
    </div> <!-- card -->
    `;


/**************************************************************
 * *************************************************************
 * On Start Function - Create the board and display dice button *
 * *************************************************************
 **************************************************************/
(function onStart(){
    return createBoard(x,y,total,size),
            throwDiceButton(player[playerTurn]);
})();


 /**************************************************************
  * Function clearStage()
  * 
  * @param {number} dice
  * @param {boolean} andMove, default: false
  * 
  * Clears the canvas stage, refreshes the board
  * if andMove is true, move the player
  * else show the dice
  * 
  * Calls refreshBoard()
  * Calls moveCharacter()
  * Calls showDice()
  * 
  *************************************************************/
function clearStage(dice, andMove = false){
    stage.removeAllChildren();
    refreshBoard();

    if(andMove){
        moveCharacter(dice, playerTurn);
    }else{
        showDice(dice);
    }

    return stage.update();
}

/**************************************************************
 * ************************************************************
 *  FUNCTIONS FOR DICE ****************************************
 * ************************************************************
 **************************************************************/

 /**************************************************************
  * Function throwDiceButton()
  * 
  * @param {number} player
  * @param {boolean} disable, default: false
  * 
  * Creates a button for "Throw Dice", adds an eventListener
  * 
  *************************************************************/
function throwDiceButton(player, disable = false){

        let buttonIMG = new Image();
        buttonIMG.src = '_assets/button.png';
        buttonIMG.crossOrigin = "Anonymous";

        let button = new createjs.Bitmap(buttonIMG);
        button.scaleX = 0.75;
        button.scaleY = 0.75;
        button.stroke
        button.x = (stage.width / 2) - 112;
        button.y = (stage.height / 2) - 200;


        // Add a line under in player color.
        createRoundRectangle(player.color, 225, button.x, (button.y + 90), 4, 10);

        // Add a text on top of the button with player number.
        let diceText = player.name + "\n Throw Dice!";
        let buttonText = new createjs.Text(diceText, "bold " + fontSizeButton + " " + fontFace, "#ffffff");
        buttonText.x = button.x + 112;
        buttonText.y = button.y + 30;
        buttonText.textBaseline = "middle";
        buttonText.textAlign = "center";
        buttonText.lineWidth = 200;
        
        if(disable){
            button.removeEventListener("click");
        }else if( player.dice == (1+total) ){
            button.removeEventListener("click");
        }else{
            button.addEventListener("click", throwDice); 
        }

        stage.addChild(button);
        stage.addChild(buttonText); 

        return stage.update();
}

 /**************************************************************
  * Function throwDice()
  * 
  * Immitates player throwing dice
  * 
  * Calls randomDice()
  * Calls throwDiceButton()
  * Calls showDice()
  * Calls stage.update()
  * Calls clearStage()
  * 
  *************************************************************/
function throwDice(){
    let dice = randomDice();

    // Show dice if player is not finished
    if( player[playerTurn].dice < (1+total) && !(player[playerTurn].dice == (1+total)) ){
        // Clear the stage, before we return the showDice function
        clearStage(dice, true);
        throwDiceButton(player[playerTurn]);

        // Return showDice function, with the dice
        return showDice(dice), stage.update();
    }
    // Remove dice image and disable dice if player is finished
    else {
        // If the player has reached finished, don't show dice
        return clearStage(dice, true);
    }
}

 /**************************************************************
  * Function randomDice()
  * 
  * Returns a random number between 1 - 6
  * 
  *************************************************************/
function randomDice(){
    // Get a random number between 1-6
    let dice = Math.floor(Math.random() * (7 - 1) + 1);
    // Return the dice number
    return dice;
}

 /**************************************************************
  * Function showDice()
  * 
  * @param {number} dice
  * 
  * Creates an dice image to canvas
  * 
  *************************************************************/
function showDice(dice){
    // Return IMG tag with the right dice number
    if(dice){
        let diceIMG = new Image();
        diceIMG.src = '_assets/dice/' + dice + '.png';
        let bitmap = new createjs.Bitmap(diceIMG);
        bitmap.x = (stage.width / 2) - 50;
        bitmap.y = (stage.height / 2) - 80;
        bitmap.stroke
    // Add the right image to the stage
    return stage.addChild(bitmap); 
    }

}

/**************************************************************
 * 
 *  FUNCTIONS FOR CREATING SHAPES / IMAGES
 * 
 **************************************************************/

 /**************************************************************
  * Function createRoundRectangle()
  * 
  * @param {string} color
  * @param {number} width
  * @param {number} xx
  * @param {number} yy
  * @param {number} radius, default: 10
  * @param {number} height, default: width
  * 
  * Creates a shape, rounded rectangle
  * adds it to the canvas stage
  * 
  *************************************************************/
function createRoundRectangle(color, width, xx, yy, radius = 10, height = width){
    var roundRect = new createjs.Shape();

    roundRect.graphics.beginFill(color).drawRoundRect(xx, yy, width, height, radius);
    roundRect.graphics.endFill();

    return stage.addChild(roundRect);
}

 /**************************************************************
  * Function createSpace()
  * 
  * @param {string} type
  * @param {number} xx
  * @param {number} yy
  * 
  * Adds an image to the canvas
  * Takes a type of space and adds to certain x & y location
  * 
  *************************************************************/
function createSpace(type, xx, yy){
    // Return IMG tag with the right dice number
    if(type && xx && yy){
        let spaceIMG = new Image();
        spaceIMG.src = '_assets/spaces/' + type + '.png';
        
        let space = new createjs.Bitmap(spaceIMG);
        space.scaleX = 0.7;
        space.scaleY = 0.7;
        space.x = xx;
        space.y = yy;

    // Add the right image to the stage
    return stage.addChild(space); 
    }
}

 /**************************************************************
  * Function winner()
  * 
  * @param {object} player
  * @param {number} playerTurn
  * @param {number} dice
  * 
  * Clears the stage, places the players.
  * Writes out winners Name, number and color to SessionStorage
  * Refreshed the browser to a winning page
  * 
  *************************************************************/
function winner(player, playerTurn, dice){
    clearStage(dice);
    startCharacter();

    sessionStorage.clear();
    sessionStorage.setItem('winner', player[playerTurn].character);
    sessionStorage.setItem('winner-player', player[playerTurn].name);
    sessionStorage.setItem('winner-color', player[playerTurn].color);

    return setInterval(function() { window.location="winner.html"; },1500);
}


/**************************************************************
 * ************************************************************
 *  FUNCTIONS FOR RANDOM TRAPS*********************************
 * ************************************************************
 **************************************************************/

 /**************************************************************
  * Function shuffleArray()
  * 
  * @param {array} array
  * 
  * Durstenfeld Shuffle from StackOverflow.com
  * Shuffles an array by picking an item and swap
  * it with the current item
  * 
  *************************************************************/
// Shuffle Array -> StackOverflow.com -> Durstenfeld Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**************************************************************
  * Function addRandomTraps()
  * Creates an object with traps
  * 
  * Adds 5x random traps to the board, using randomizing
  * Adds location, message, trap to "Space" array
  *  
  * Calls shuffleArray()
  * Calls createSpace()
  * Calls addNumbers
  * 
  *************************************************************/
function addRandomTraps(){
    // Create the random traps
    var randomTrap = [
        { trap : -1, message : 'You are bitten by a snake! <br> Go back ' },
        { trap : -3, message : 'Winter is Here! <br> Go back '  },
        { trap : -8, message : 'Shame! Shame! Shame! <br> You take the walk of shame! <br> Go Back '  },
        { trap : -6, message : 'A dragon in your path... <br> Retreat! <br> Go back '  },
        { trap : -2, message : 'Ned Stark is beheaded by King Joffrey´s executioner! <br> You go back to watch! <br> Go Back'  }
];
    shuffleArray(randomTrap);
    let isItUsed = [];
    let randomTrapNumber;

    for(var i = 0; i < 5; i++){
        randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
        
        // Check if the space has been used for a trap
        if( isItUsed.includes(randomTrapNumber) ){ 
            randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
            i--;
        }
        // Check if the spaces next to the chosen one have traps
        else if( 'trap' in space[randomTrapNumber-1]  || 'trap' in space[randomTrapNumber+1] ){
            randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
            i--;
        // If the space and those next to it dont contain trap, add it!
        }else{
            isItUsed[i] = randomTrapNumber;
            space[randomTrapNumber].trap = randomTrap[i];
            space[randomTrapNumber].type = 'trap';
            createSpace('trap', space[randomTrapNumber].x,space[randomTrapNumber].y);
            addNumbers(randomTrapNumber+1, space[randomTrapNumber].color, space[randomTrapNumber].x + (size/2), space[randomTrapNumber].y + (size/2), space[randomTrapNumber].size);
        }
    }
}

/**************************************************************
 * ************************************************************
 *  FUNCTIONS FOR CHARACTER / TOKEN  **************************
 * ************************************************************
 **************************************************************/


/**************************************************************
  * Function addTrapOverlay()
  * @param {string} elementID
  * @param {string} classToggle
  * @param {string/number} player
  * @param {array} trapMessage
  * 
  * Creates a screen overlay with image and text
  * 
  *************************************************************/
 
function addTrapOverlay(elementID, classToggle, player, trapMessage){
    let x = document.getElementById(elementID);

    if( x.innerHTML ){
        x.innerHTML = '';
    }else{
        x.innerHTML = `
            <div class="col-sm-12 mx-auto text-center" style="margin-top: 2rem;">
            <img src="_assets/shield-snake.png" alt="A Shield" class="imageOverlayShield">
            </div>
            <div class="col-sm-12 mx-auto text-center">
                <h1>You landed on a trap!</h1>
                <h4>` + trapMessage[0] + `  `+ trapMessage[1] + ` spaces!<br></h4>
                <h5>From space: ` + trapMessage[2] + ` to space: ` + trapMessage[3] + `<br></h5>
                <a href="" class="btn btn-primary btn-primary-medtext btn-primary-` + player + `" style="margin-top: 1rem; width: 50%;" id="GoOn">Go On!</a>
            </div>
            `;
    }

    if( document.getElementById('GoOn') ){
        let button = document.getElementById('GoOn');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addTrapOverlay('trapOverlay', 'trapOverlay');
        });
    }
    return x.classList.toggle(classToggle);

}

/**************************************************************
  * Function startCharacter()
  * 
  * Creates a shape for the player, 
  * Uses addNumbers() to number the shape.
  * Returns a stage.update() 
  * 
  *************************************************************/
function startCharacter(){
    createRoundRectangle(player[0].color, 40, player[0].x, player[0].y);
    addNumbers(player[0].num, "#ffffff", player[0].x+20, player[0].y+20);

    createRoundRectangle(player[1].color, 40, player[1].x, player[1].y);
    addNumbers(player[1].num, "#ffffff", player[1].x+20, player[1].y+20);

    return stage.update();
}

/**************************************************************
  * Function moveCharacter()
  * @param {number} dice
  * 
  * Creates the movement of the player. 
  * Loops the player through the spaces and 
  * Checks the space where the player lands.
  * 
  * It contains a self-evoking function next()
  * The function loops through itself after dice,
  * It uses setTimeout for the player movement.
  * 
  *************************************************************/
function moveCharacter(dice){
    
    var maxLoops = dice - 1;
    var counter = 0;
    
    (function next() {
        startCharacter();
        if (counter++ > maxLoops) {

            // If the player throws a 6 for the first time
            if( dice === 6 && doubles === 0 ){

                let diceMessage = player[playerTurn].name + ' got lucky! \n And gets an extra round!';
                
                // On last movement, add 1 to doubles
                if( dice === counter-1 ){
                    doubles++;
                }
                // if the player rolled doubles but then landed on a trap.
                if('trap' in space[player[playerTurn].dice-1]) {

                    // Write the dice to player, and set the location.
                    player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                    player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;
                    startCharacter();

                    // Calculate landing space after trap.
                    let newDice = player[playerTurn].dice + space[player[playerTurn].dice-1].trap.trap;
        
                    // If the player exceeds finish space, player ends up on finish space
                    if( newDice <= 0){ newDice = 1; }else if( newDice >= 30){ newDice = 30;}
        
                    // Create the trapMessage, array.
                    let trapMessage = [space[player[playerTurn].dice-1].trap.message, space[player[playerTurn].dice-1].trap.trap, player[playerTurn].dice, newDice];
                    
                    // Write the dice to player, and set the location --> After the trap.
                    player[playerTurn].dice = newDice;
                    player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                    player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;
    
                        // Add the overlay with trap message
                        addTrapOverlay('trapOverlay', 'trapOverlay', player[playerTurn].num, trapMessage);

                        // If the player lands on finish, end the game.
                        if ( player[playerTurn].dice >= (1+total) ){ winner(player, playerTurn, dice); }

                        // Tell the player there will be no extra round
                        let diceMessage = player[playerTurn].name + '\n got tangled in a trap! \n No Extra Round!';

                        // Change to other player
                        playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                        
                    return clearStage(), showDice(dice), startCharacter(), addText(diceMessage, messageColor,0,30), playerTurn, throwDiceButton(player[playerTurn]), doubles = 0;
  
                }else{
                    return startCharacter(), stage.update(), playerTurn, throwDiceButton(player[playerTurn]), addText(diceMessage, messageColor,0,30);
                }
            // if the player lands on a trap.
            } else if('trap' in space[player[playerTurn].dice-1]) {
                // Set the location of the player and write to canvas.
                player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;
                startCharacter();

                    // Calculate landing space after trap.
                    let newDice = player[playerTurn].dice + space[player[playerTurn].dice-1].trap.trap;

                    // If the player exceeds finish space, player ends up on finish space
                    if( newDice <= 0){ newDice = 1; }else if( newDice >= 30){ newDice = 30;}

                    // Create the trapMessage, array.
                    let trapMessage = [space[player[playerTurn].dice-1].trap.message, space[player[playerTurn].dice-1].trap.trap, player[playerTurn].dice, newDice];
                    
                    // Write the dice to player, and set the location --> After the trap.
                    player[playerTurn].dice = newDice;
                    player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                    player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;

                    // Add the overlay with trap message
                    addTrapOverlay('trapOverlay', 'trapOverlay', player[playerTurn].num, trapMessage);

                    // If the player lands on finish, end the game.
                    if ( player[playerTurn].dice >= (1+total) ){ winner(player, playerTurn, dice); }

                    // Change to other player
                    playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;

                    return clearStage(), showDice(dice), startCharacter(), playerTurn, throwDiceButton(player[playerTurn]), doubles = 0;

            // If the player doesn't land on a trap or throws a 6
            }else{
                // Change to other player
                playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                return startCharacter(), stage.update(), playerTurn, doubles = 0, throwDiceButton(player[playerTurn]);
            }

        }

        // Timeout function for a slow and great looking movement
        setTimeout(function() {

            // if the player throws a 6 for the second time
            if( dice === 6 && doubles >= 1 ){
                let diceMessage = player[playerTurn].name + ' is getting too lucky! \n It stops now, no movement!';

                // change to other player
                playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;

                return clearStage(), addText(diceMessage, messageColor, 0, 30), startCharacter(), showDice(dice), playerTurn,throwDiceButton(player[playerTurn]), doubles = 0;
            }

            // if the player hasn't reached the finish
            if( player[playerTurn].dice < (1+total) ){
                player[playerTurn].dice++
            }

                if( player[playerTurn].dice < (1+total) ){
                        player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                        player[playerTurn].y = space[(player[playerTurn].dice-1)].y +  player[playerTurn].marginY;
                }

                // If the player has reached finish, end game
                else if ( player[playerTurn].dice >= (1+total) ){
                    player[playerTurn].x = space[total].x + player[playerTurn].marginX;
                    player[playerTurn].y = space[total].y + player[playerTurn].marginY;
                    winner(player, playerTurn, dice);
                }
                
                clearStage(dice);
                throwDiceButton(player[playerTurn], true), 
                startCharacter();

            next();
        }, 300); // 300ms delay
    })();
}

/**************************************************************
 * ************************************************************
 *  FUNCTIONS FOR CREATING BOARD*******************************
 * ************************************************************
 **************************************************************/

 /**************************************************************
  * Function addText()
  * @param {string} text
  * @param {string} color
  * @param {number} xx
  * @param {number} yy
  * 
  * Creates a centered Canvas Text
  * 
  *************************************************************/
function addText(text, color,xx,yy){
    let message = new createjs.Text(text, "bold " + fontSizeMessage + " " + fontFace, color);
    message.x = xx + (stage.width / 2); 
    message.y = yy + (stage.width / 2);
    message.textAlign = "center";
    message.lineWidth = 350;

    return stage.addChild(message), stage.update();
}

 /**************************************************************
  * Function addNumbers()
  * @param {string/number} number
  * @param {string} color
  * @param {number} xx
  * @param {number} yy
  * @param {string} fontSize, default: fontSizeNumbers variable
  * 
  * Creates a centered Canvas Text/Number
  * 
  *************************************************************/
function addNumbers(number, color, xx, yy, fontSize = fontSizeNumbers){
    let numbers = new createjs.Text(number,  "BOLD " + fontSize + " " + fontFaceNumbers, color);
    numbers.x = xx;
    numbers.y = yy;
    numbers.textBaseline = "middle";
    numbers.textAlign = "center";

    return stage.addChild(numbers), stage.update();
}

 /**************************************************************
  * Function createBoard()
  * @param {number} x
  * @param {number} y
  * @param {number} total --> Variable declared on line 29
  * 
  * Creates a Board, adds to "space" array, different locations
  * Calls createSpace() function
  * Calls addNumbers() function
  * Calls addRandomTraps() function
  * 
  *************************************************************/
function createBoard(x,y, total){

    for( let i = 0; i <= total; i++){
        if( i <= layout[0] ){
            x = x + spacing;
            space[i] = { 'x' : x, 'y' : y };
        }
        else if ( i <= layout[1] ){
            y = y + spacing;
            space[i] = { 'x' : x, 'y' : y };
        }
        else if ( i <= layout[2] ){
            x = x - spacing;
            space[i] = { 'x' : x, 'y' : y };
        }
        else if ( i <= layout[3] ){
            y = y - spacing;
            space[i] = { 'x' : x, 'y' : y };
        }
        
        if( i == total ) {
            createSpace('space-finish', x, y);
            space[i].type = 'space-finish';
            space[i].color = '#fff';
            space[i].size = '31px';
        }else{
            createSpace('space', x, y);
            space[i].type = 'space';
            space[i].color = numberColor;
            space[i].size = fontSizeNumbers;
        }
        addNumbers(i+1, space[i].color, x + (size/2), y + (size/2), space[i].size);
    }  

    return addRandomTraps(), stage.update();
}

 /**************************************************************
  * Function refreshBoard()
  * Uses "Space" array, reads the different board spaces
  * And creates the board from that.
  * 
  * For Loop, 
  * Calls createSpace
  * Calls addNumbers
  * 
  *************************************************************/
function refreshBoard() {
    for( let i = 0; i <= total; i++){
        createSpace(space[i].type, space[i].x, space[i].y);
        addNumbers(i+1, space[i].color, space[i].x + (size/2), space[i].y + (size/2), space[i].size);
    }
    return stage.update();
}

} // end if player chosen
else{ // Fallback, if no sessionStorage is set.
    document.getElementById('testCanvas').parentElement.innerHTML = `
    <h1 style="color: white;">No Players Chosen!</h1>
    <a href="characters.html" class="btn btn-primary" style="margin-top: 2rem;">Go Play?</a>`;
}