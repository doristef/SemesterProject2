/**************************************************************
 * 
 *  VARIABLES FOR THE GAME
 * 
 **************************************************************/
/* COLORS 
#849baa - Muted Green/Blue
#435274 - Muted Dark Blue
*/
 /* START THE CANVAS - ADD HEIGHT / WIDTH */
const stage = new createjs.Stage("testCanvas");
const fontFace = 'Cinzel Decorative';
const fontFaceNumbers = 'Cinzel';
const fontSizeButton = '22px';
const fontSizeMessage = '24px';
const fontSizeNumbers = '24px';

const messageColor = '#fff';
const numberColor = '#fff';

// Set the width and height of the canvas
stage.width = 800;
stage.height = 800;

// Set the ticker to 60fps
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);

/* DICE VARIABLES - OLD BUTTON
var throwDices = document.getElementById('throw')
throwDices.addEventListener("click", throwDice);  */

/* CREATE BOARD VARIABLES */
const size = 70;
const spacing = 70;
const total = 29; // Starts from 0 = 30
var space = [];

/* BOARD LAYOUT */
const layout = [8, 15, 23, 30];
var x = 15;
var y = 100;

/* PLAYER VARIABLES */
var playerX = 0, playerY = 0, playerDice =[0,0];
let doubles = 0;
var player = [{character : "", name : "Player 1", num : '1', color : "#febc2c", x : x + 25, y : y + 13, dice : 0, marginX : 12, marginY : 13}, 
                {character : "", name : "Player 2", num : '2', color : "#2badff", x : x + 25, y : y + 7, dice : 0, marginX : 17, marginY : 7}];

var playerTurn = 0;

if( sessionStorage.getItem('player1') && sessionStorage.getItem('player2')){
    player[0].number = sessionStorage.getItem('player1');
    player[1].number = sessionStorage.getItem('player2')
    player[0].character = sessionStorage.getItem('player1Name');
    player[1].character = sessionStorage.getItem('player2Name');
    /*
    sessionStorage.removeItem('player1');
    sessionStorage.removeItem('player2');
    */

    document.getElementById('player1').innerHTML += `
    <div class="card text-center">
    <div class="card-body">
        <h5 class="card-title text-center">`+ player[0].name + `</h5>
        <span style="display: block; background-color: ` + player[0].color + `; width: 100%; height: 25px;">` + player[0].character + `</span>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ player[0].number + `.png" alt="Card image" style="max-height: 100px; max-width: 100px;">
        
    </div>
        
    </div> <!-- card -->
    `;

    document.getElementById('player2').innerHTML += `
    <div class="card text-center">
    <div class="card-body">
        <h5 class="card-title text-center">`+ player[1].name + `</h5>
        <span style="display: block; background-color: ` + player[1].color + `; width: 100%; height: 25px;">` + player[1].character + `</span>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ player[1].number + `.png" alt="Card image" style="max-height: 100px; max-width: 100px;">
    </div>
    </div> <!-- card -->
    `;


/* ON GAME START - Call Functions */
createBoard(x,y,total,size);
throwDiceButton(player[playerTurn]);
startCharacter(x,y);

/**************************************************************
 * 
 *  FUNCTIONS FOR CANVAS
 * 
 **************************************************************/
function clearStageNoMove(){
    stage.removeAllChildren();
    refreshBoard();
    startCharacter();

    return stage.update();
}
function clearStage(dice){
    stage.removeAllChildren();
    refreshBoard();
    moveCharacter(dice, playerTurn);

    return stage.update();
}

function clearStageMove(dice){
    stage.removeAllChildren();
    refreshBoard();
    showDice(dice);

    return stage.update();
}

/**************************************************************
 * 
 *  FUNCTIONS FOR DICE
 * 
 **************************************************************/


function throwDiceButton(player){

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
    
    if( player.dice == (1+total) ){
        button.removeEventListener("click");
    }else{ 
        button.addEventListener("click", throwDice);    
        stage.addChild(button);
        stage.addChild(buttonText); 
    }

    return stage.update();
}

function throwDice(){
    let dice = randomDice();

    // Show dice if player is not finished
    if( player[playerTurn].dice < (1+total) && !(player[playerTurn].dice == (1+total)) ){
        // Clear the stage, before we return the showDice function
        clearStage(dice);
        throwDiceButton(player[playerTurn]);

        // Return showDice function, with the dice
        return showDice(dice), stage.update();
    }
    // Remove dice image and disable dice if player is finished
    else {
        // If the player has reached finished, don't show dice
        return clearStage(dice);
    }
}

function randomDice(){
    // Get a random number between 1-6
    let dice = Math.floor(Math.random() * (7 - 1) + 1);
    // Return the dice number
    return dice;
}

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

function removeDice(){
    return stage.removeChild(bitmap);
}

/**************************************************************
 * 
 *  FUNCTIONS FOR CREATING SHAPES / IMAGES
 * 
 **************************************************************/

function createRoundRectangle(color, width, xx, yy, radius = 10, height = width){
    var roundRect = new createjs.Shape();

    roundRect.graphics.beginFill(color).drawRoundRect(xx, yy, width, height, radius);
    roundRect.graphics.endFill();

    return stage.addChild(roundRect);
}

function createRectangle(color, width, xx, yy, height = width){
    let rect = new createjs.Shape();

    rect.graphics.beginFill(color).drawRect(xx, yy, width, height);
    rect.graphics.endFill();

    return stage.addChild(rect);
}

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
 * 
 *  FUNCTIONS FOR RANDOM TRAPS
 * 
 **************************************************************/

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function addRandomTraps(){

    var randomTrap = [
        { alert : -1, message : 'You are bitten by a snake! <br> Go back ' },
        { alert : -3, message : 'Winter is Here! <br> Go back '  },
        { alert : -8, message : 'Shame! Shame! Shame! <br> You take the walk of shame! <br> Go Back '  },
        { alert : -6, message : 'A dragon in your path... <br> Retreat! <br> Go back '  },
        { alert : -2, message : 'Ned Stark is beheaded by King Joffrey´s executioner! <br> You go back to watch! <br> Go Back'  }
    ];
    shuffleArray(randomTrap);
    let isItUsed = [];
    let randomTrapNumber;

    for(var i = 0; i < 5; i++){
        randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
        
        if( isItUsed.includes(randomTrapNumber) ){
            randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
            i--;
        }
        else if( 'trap' in space[randomTrapNumber-1]  || 'trap' in space[randomTrapNumber+1] ){
            randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
            i--;
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
 * 
 *  FUNCTIONS FOR CHARACTER / TOKEN
 * 
 **************************************************************/

function addTrapOverlay(elementId, classToggle, player, trapMessage){
    let x = document.getElementById(elementId);

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

function startCharacter(){
    createRoundRectangle(player[0].color, 40, player[0].x, player[0].y);
    addNumbers(player[0].num, "#ffffff", player[0].x+20, player[0].y+20);

    createRoundRectangle(player[1].color, 40, player[1].x, player[1].y);
    addNumbers(player[1].num, "#ffffff", player[1].x+20, player[1].y+20);

    // Return new canvas along with placement of token
    return stage.update();
}

function moveCharacter(dice){
    
    var maxLoops = dice - 1;
    var counter = 0;
    
    (function next() {
        startCharacter();
        if (counter++ > maxLoops) {
            if( dice === 6 && doubles === 0 ){
                let diceMessage = player[playerTurn].name + ' got lucky! \n And will get an extra round!';
                
                if( dice === counter-1 ){
                    doubles++;
                }

                if('trap' in space[player[playerTurn].dice-1]) {
                    let newDice = player[playerTurn].dice + space[player[playerTurn].dice-1].trap.alert;
        
                    if( newDice <= 0){ newDice = 1; }else if( newDice >= 30){ newDice = 30;}
        
                    let trapMessage = [space[player[playerTurn].dice-1].trap.message, space[player[playerTurn].dice-1].trap.alert, player[playerTurn].dice, newDice];
        
                    player[playerTurn].dice = newDice;
                    player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                    player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;
    
                    // ADD THE TRAPMESSAGE IN OVERLAY
                    addTrapOverlay('trapOverlay', 'trapOverlay', player[playerTurn].num, trapMessage);
    
                        if ( player[playerTurn].dice >= (1+total) ){
    
                            clearStageMove(dice);
                            startCharacter();
        
                            sessionStorage.clear();
                            sessionStorage.setItem('winner', player[playerTurn].character);
                            sessionStorage.setItem('winner-player', player[playerTurn].name);
                            return setInterval(function() { window.location="winner.html"; },1500);
                        }

                    let diceMessage = player[playerTurn].name + ' got tangled in a trap! \n And gets no extra round!';
                    playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                        
                        return clearStageMove(), showDice(dice), startCharacter(), addText(diceMessage, messageColor,0,30), playerTurn, throwDiceButton(player[playerTurn]), doubles = 0;
  
                }else{
                return startCharacter(), stage.update(), playerTurn, throwDiceButton(player[playerTurn]), addText(diceMessage, messageColor,0,30);
                }
            }
            
            else if('trap' in space[player[playerTurn].dice-1]) {
                let newDice = player[playerTurn].dice + space[player[playerTurn].dice-1].trap.alert;
    
                if( newDice <= 0){ newDice = 1; }else if( newDice >= 30){ newDice = 30;}
    
                let trapMessage = [space[player[playerTurn].dice-1].trap.message, space[player[playerTurn].dice-1].trap.alert, player[playerTurn].dice, newDice];
    
                player[playerTurn].dice = newDice;
                player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;

                // ADD THE TRAPMESSAGE IN OVERLAY
                addTrapOverlay('trapOverlay', 'trapOverlay', player[playerTurn].num, trapMessage);

                    if ( player[playerTurn].dice >= (1+total) ){

                        clearStageMove(dice);
                        startCharacter();
    
                        sessionStorage.clear();
                        sessionStorage.setItem('winner', player[playerTurn].character);
                        sessionStorage.setItem('winner-player', player[playerTurn].name);
                        return setInterval(function() { window.location="winner.html"; },1500);
                    }
                
                playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                return clearStageMove(), showDice(dice), startCharacter(), playerTurn, throwDiceButton(player[playerTurn]);
            }else{
                playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                return startCharacter(), stage.update(), playerTurn, doubles = 0, throwDiceButton(player[playerTurn]);
            }

        }

        setTimeout(function() {
 
            if( dice === 6 && doubles >= 1 ){
                let diceMessage = player[playerTurn].name + ' luck bit her in the ass! \n There will be no movement at all this round!';
                playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                return clearStageMove(), addText(diceMessage, messageColor, 0, 30), startCharacter(), showDice(dice), playerTurn,throwDiceButton(player[playerTurn]), doubles = 0;
            }
            if( player[playerTurn].dice < (1+total) ){
                player[playerTurn].dice++
            }
                if( player[playerTurn].dice < (1+total) ){
                        player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                        player[playerTurn].y = space[(player[playerTurn].dice-1)].y +  player[playerTurn].marginY;
                }
                else if ( player[playerTurn].dice >= (1+total) ){
                    player[playerTurn].x = space[total].x + player[playerTurn].marginX;
                    player[playerTurn].y = space[total].y + player[playerTurn].marginY;

                    clearStageMove(dice);
                    startCharacter();

                    sessionStorage.clear();
                    sessionStorage.setItem('winner', player[playerTurn].character);
                    sessionStorage.setItem('winner-player', player[playerTurn].name);
                    return setInterval(function() { window.location="winner.html"; },1500);
    
                }
                
                clearStageMove(dice);
                throwDiceButton(player[playerTurn]), 
                startCharacter();

            next();
        }, 300);
    })();
}

/**************************************************************
 * 
 *  FUNCTIONS FOR CREATING BOARD
 * 
 **************************************************************/
function addText(text, color,xx,yy){
    let message = new createjs.Text(text, "bold " + fontSizeMessage + " " + fontFace, color);
    message.x = xx + (stage.width / 2); 
    message.y = yy + (stage.width / 2);
    message.textAlign = "center";
    message.lineWidth = 350;
    return stage.addChild(message), stage.update();
}

function addNumbers(number, color, x, y, fontSize = fontSizeNumbers){
    let numbers = new createjs.Text(number,  "BOLD " + fontSize + " " + fontFaceNumbers, color);
    numbers.x = x;
    numbers.y = y;
    numbers.textBaseline = "middle";
    numbers.textAlign = "center";

    return stage.addChild(numbers), stage.update();
}

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

function refreshBoard() {
    for( let i = 0; i <= total; i++){
        createSpace(space[i].type, space[i].x, space[i].y);
        addNumbers(i+1, space[i].color, space[i].x + (size/2), space[i].y + (size/2), space[i].size);
    }
    return stage.update();
}

} // end if player chosen
else{ // Fallback, if no sessionStorage is set.
    document.getElementById('testCanvas').parentElement.innerHTML = '<h1 style="color: white;">No Players Chosen!</h1><a href="characters.html" class="btn btn-primary" style="margin-top: 2rem;">Go Play?</a>';
}