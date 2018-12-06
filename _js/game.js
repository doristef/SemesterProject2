/**************************************************************
 * 
 *  VARIABLES FOR THE GAME
 * 
 **************************************************************/

 /* START THE CANVAS - ADD HEIGHT / WIDTH */
const stage = new createjs.Stage("testCanvas");

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
const size = 65;
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
var player = [{character : "", name : "Player 1", color : "green", x : x + 25, y : y + 13, dice : 0, marginX : 12, marginY : 13}, 
                {character : "", name : "Player 2", color : "blue", x : x + 25, y : y + 7, dice : 0, marginX : 17, marginY : 7}];

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
        <span style="display: block; background-color: ` + player[0].color + `; width: 100%; height: 25px;"> Colour</span>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ player[0].number + `.png" alt="Card image" style="max-height: 100px; max-width: 100px;">
        
    </div>
        
    </div> <!-- card -->
    `;

    document.getElementById('player2').innerHTML += `
    <div class="card text-center">
    <div class="card-body">
        <h5 class="card-title text-center">`+ player[1].name + `</h5>
        <span style="display: block; background-color: ` + player[1].color + `; width: 100%; height: 25px;"> Colour</span>
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
    createBoard(x,y,total,size);
    startCharacter();

    return stage.update();
}
function clearStage(dice){
    stage.removeAllChildren();
    createBoard(x,y,total,size);
    moveCharacter(dice, playerTurn);

    return stage.update();
}

function clearStageMove(dice){
    stage.removeAllChildren();
    createBoard(x,y,total,size);
    showDice(dice);

    return stage.update();
}

/**************************************************************
 * 
 *  FUNCTIONS FOR DICE
 * 
 **************************************************************/

function throwDiceButton(player){
    let diceButton = new createjs.Shape();
    let diceButtonColor = player.color;
    diceButton.x = (stage.width / 2) - 87;
    diceButton.y = (stage.height / 2) - 200;
    diceButton.graphics.beginFill(diceButtonColor);
    diceButton.graphics.drawRect(0,0, 175, 75);
    diceButton.graphics.endFill();
    let diceText = player.name + " Throw Dice!";
    let diceButtonText = new createjs.Text(diceText, "bold 25px Arial", "white");
    diceButtonText.x = diceButton.x + 87;
    diceButtonText.y = diceButton.y + 25;
    diceButtonText.textBaseline = "middle";
    diceButtonText.textAlign = "center";
    diceButtonText.lineWidth = 150;
    
    if( player.dice == (1+total) ){
        diceButton.removeEventListener("click");
    }else{ 
        diceButton.addEventListener("click", throwDice);    
        stage.addChild(diceButton);
        stage.addChild(diceButtonText); 
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
        createRectangle(player[playerTurn].color, 40, player[playerTurn].x, player[playerTurn].y);

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
        bitmap.y = (stage.height / 2) - 115;
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
 *  FUNCTIONS FOR CREATING SHAPES
 * 
 **************************************************************/

function createRectangle(color,size,x,y){
    let rect = new createjs.Shape();
    rect.x = x;
    rect.y = y;
    rect.graphics.beginFill(color);
    rect.graphics.drawRect(0, 0, size, size);
    rect.graphics.endFill();

    // return rectangle to canvas
    return stage.addChild(rect);
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
        { alert : -1, message : 'Queen Latifah sends you back! <br> Go back ' },
        { alert : -3, message : 'Winter is Here! <br> Go back '  },
        { alert : +4, message : 'The sun is shining,<br> move forward '  },
        { alert : -6, message : 'A dragon in your path... <br> Retreat! <br> Go back '  },
        { alert : +2, message : 'You found a shortcut, <br> move forward '  }
    ];
    shuffleArray(randomTrap);
    let isItUsed = [];
    let randomTrapNumber;

    for(var i = 0; i < 5; i++){
        randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
        
        if( isItUsed.includes(randomTrapNumber) ){
            randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
            i--;
        }else{
            isItUsed[i] = randomTrapNumber;
            space[randomTrapNumber].trap = randomTrap[i];
        }

    }
}

/**************************************************************
 * 
 *  FUNCTIONS FOR CHARACTER / TOKEN
 * 
 **************************************************************/

function addTrapOverlay(elementId, classToggle, trapMessage){
    let x = document.getElementById(elementId);

    if( x.innerHTML ){
        x.innerHTML = '';
    }else{
        x.innerHTML = `
            <div class="col-sm-12 mx-auto text-center" style="margin-top: 2rem;">
                <h1>HERE COMES THE SHIELD</h1>>
            </div>
            <div class="col-sm-12 mx-auto text-center" >
                <h1>SOMETHING IN YOUR PATH!</h1>>
                <h4>` + trapMessage[0] + `  `+ trapMessage[1] + ` spaces!<br></h4>
                <h5>From space: ` + trapMessage[2] + ` to space: ` + trapMessage[3] + `<br></h5>
                <a href="" class="btn btn-primary" style="margin-top: 2rem;" id="GoOn">Go On!</a>
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
    createRectangle(player[0].color, 40, player[0].x, player[0].y);
    createRectangle(player[1].color, 40, player[1].x, player[1].y);

    // Return new canvas along with placement of token
    return stage.update();
}

function movethecharacter(playerTurn, newx, newy){
    createRectangle(player[playerTurn].color, 40, newx, newy);

    return stage.update();
}

function moveCharacter(dice){
    
    var maxLoops = dice - 1;
    var counter = 0;
    
    (function next() {
        startCharacter();
        if (counter++ > maxLoops) {
            if( dice === 6 && doubles === 0 ){
                let diceMessage = player[playerTurn].name + ' rolled the big 6! \n And will get another turn!';
                
                if( dice === counter-1 ){
                    doubles++;
                }
                return startCharacter(), stage.update(), playerTurn, throwDiceButton(player[playerTurn]),addText(diceMessage, 'red',0,15);
            }
            
            else if('trap' in space[player[playerTurn].dice]) {
                let newDice = player[playerTurn].dice + space[player[playerTurn].dice].trap.alert;
    
                if( newDice <= 0){ newDice = 1; }else if( newDice >= 30){ newDice = 30;}
    
                let trapMessage = [space[player[playerTurn].dice].trap.message, space[player[playerTurn].dice].trap.alert, player[playerTurn].dice, newDice];
    
                player[playerTurn].dice = newDice;
                player[playerTurn].x = space[(player[playerTurn].dice-1)].x + player[playerTurn].marginX;
                player[playerTurn].y = space[(player[playerTurn].dice-1)].y + player[playerTurn].marginY;

                // ADD THE TRAPMESSAGE IN OVERLAY
                addTrapOverlay('trapOverlay', 'trapOverlay', trapMessage);

                    if ( player[playerTurn].dice >= (1+total) ){

                        clearStageMove(dice);
                        startCharacter();
    
                        sessionStorage.clear();
                        sessionStorage.setItem('winner', player[playerTurn].character);
                        sessionStorage.setItem('winner-player', player[playerTurn].name);
                        return setInterval(function() { window.location="winner.html"; },1000);
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
                let diceMessage = player[playerTurn].name + ' rolled the big 6 AGAIN!! \n And will not move at all this round!';
                playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
                return clearStageMove(), addText(diceMessage, 'red',0,15), startCharacter(), showDice(dice), playerTurn,throwDiceButton(player[playerTurn]), doubles = 0;
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
                    return setInterval(function() { window.location="winner.html"; },1000);
    
                }
                
                clearStageMove(dice);
                startCharacter();

            next();
        }, 200);
    })();
    
    // Return new canvas along with placement of token

    /*     setTimeout( function(){
    do{

        if( dice === 6 && doubles >= 1 ){
            let diceMessage = player[playerTurn].name + ' rolled the big 6 AGAIN!! \n And will not move at all this round!';
            playerTurn = playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
            return startCharacter(), addText(diceMessage, 'red',0,-15), stage.update(), playerTurn, dice = 0;
        }
        if( player[playerTurn].dice < (1+total) ){
            player[playerTurn].dice++
        }
            if( player[playerTurn].dice < (1+total) ){
                    player[playerTurn].x = space[(player[playerTurn].dice-1)].x + 15;
                    player[playerTurn].y = space[(player[playerTurn].dice-1)].y + 10;
            }
            else if ( player[playerTurn].dice >= (1+total) ){
                player[playerTurn].x = space[total].x + 15;
                player[playerTurn].y = space[total].y + 10;

                sessionStorage.clear();
                sessionStorage.setItem('winner', player[playerTurn].character);
                sessionStorage.setItem('winner-player', player[playerTurn].name);
                return setInterval(function() { window.location="winner.html"; },1000);

            }
            clearStageMove();
            movethecharacter(playerTurn, player[playerTurn].x, player[playerTurn].y);
            i++;
     
    }while(i < dice);

}, 1000); */
}

/**************************************************************
 * 
 *  FUNCTIONS FOR CREATING BOARD
 * 
 **************************************************************/
function addText(text, color,xx,yy){
    let message = new createjs.Text(text, "bold 20px Arial", color);
    message.x = xx + (stage.width / 2); 
    message.y = yy + (stage.width / 2);
    message.textAlign = "center";
    message.lineWidth = 350;
    return stage.addChild(message), stage.update();
}

function addNumbers(number, color, x,y){
    let numbers = new createjs.Text(number, "bold 25px Arial", color);
    numbers.x = x + (size/2);
    numbers.y = y + (size/2);
    numbers.textBaseline = "middle";
    numbers.textAlign = "center";
    return stage.addChild(numbers), stage.update();
}

function createBoard(x,y, total, size, ){

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
        createRectangle("red", size, x,y)
        addNumbers(i+1, "black", x,y);
    }
    return addRandomTraps(), stage.update();
}
} // end if player chosen
else{ // Fallback, if no sessionStorage is set.
    document.getElementById('testCanvas').parentElement.innerHTML = '<h1 style="color: white;">No Players Chosen!</h1><a href="characters.html" class="btn btn-primary" style="margin-top: 2rem;">Go Play?</a>';
}