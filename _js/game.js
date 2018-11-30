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
const total = 29; // Starts from 0
var space = [];

/* BOARD LAYOUT */
const layout = [8, 15, 23, 30];
var x = 15;
var y = 100;

/* PLAYER VARIABLES */
var playerX = 0, playerY = 0, playerDice =[0,0];

var player = [{name : "Player 1", color : "green", x : x + 25, y : y + 10, dice : 0}, {name : "Player 2", color : "blue", x : x + 25, y : y + 10, dice : 0}];

var playerTurn = 0;

if( sessionStorage.getItem('player1') && sessionStorage.getItem('player2')){
    player[0].number = sessionStorage.getItem('player1');
    player[1].number = sessionStorage.getItem('player2')
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
}

/* ON GAME START - Call Functions */
createBoard(x,y,total,size);
throwDiceButton();
startCharacter(x,y);

/**************************************************************
 * 
 *  FUNCTIONS FOR CANVAS
 * 
 **************************************************************/
function clearStageNoMove(dice){
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

/**************************************************************
 * 
 *  FUNCTIONS FOR DICE
 * 
 **************************************************************/

function throwDiceButton(){
    let diceButton = new createjs.Shape();
    let diceButtonColor = "blue";
    diceButton.x = (stage.width / 2) - 75;
    diceButton.y = (stage.height / 2) - 200;
    diceButton.graphics.beginFill(diceButtonColor);
    diceButton.graphics.drawRect(0,0, 150, 50);
    diceButton.graphics.endFill();

    let diceButtonText = new createjs.Text("Throw Dice!", "bold 25px Arial", "white");
    diceButtonText.x = diceButton.x + 75;
    diceButtonText.y = diceButton.y + 25;
    diceButtonText.textBaseline = "middle";
    diceButtonText.textAlign = "center";
    
    if( player[playerTurn].dice == (1+total) ){
        diceButton.removeEventListener("click");
    }else{ 
        diceButton.addEventListener("click", throwDice);    
        stage.addChild(diceButton);
        stage.addChild(diceButtonText); 
    }

    return stage.update();
}
function showCharacter(key){
    createRectangle(player[key].color, 40, player[key].x, player[key].y);
}
function throwDice(){
    let dice = randomDice();

    // Show dice if player is not finished
    if( player[playerTurn].dice < (1+total) && !(player[playerTurn].dice == (1+total)) ){
        // Clear the stage, before we return the showDice function
        clearStage(dice);
        throwDiceButton();
        showCharacter(playerTurn);

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
    let dice = Math.floor(Math.random() * (6 - 1) + 1);
    // Return the dice number
    return dice;
}

function showDice(dice){
    // Return IMG tag with the right dice number
    let diceIMG = new Image();
        diceIMG.src = '_assets/dice/' + dice + '.png';
    let bitmap = new createjs.Bitmap(diceIMG);
        bitmap.x = (stage.width / 2) - 50;
        bitmap.y = (stage.height / 2) -125;

    // Add the right image to the stage
    return stage.addChild(bitmap);
    
}

/**************************************************************
 * 
 *  FUNCTIONS FOR CREATING SHAPES
 * 
 **************************************************************/
function createCircle(key){

    let circle = [];

    for(i = 0; i < key; i++){
        circle = new createjs.Shape();
        circle.graphics.beginFill("Red").drawCircle(0,0,30);
        circle.x = 100 + (i * 50);
        circle.y = 100 + (i * 50);
        stage.addChild(circle);
        
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);
    
        createjs.Tween.get(circle, {loop: true})
        .to({alpha:0, x: 400}, 3000, createjs.Ease.elasticInOut)
        .to({alpha:1, x: circle.x}, 3000, createjs.Ease.elasticInOut);
    }
}

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
        { alert : -1, message : 'Bla bla random GoT quote! ' },
        { alert : -3, message : 'Bla bla random GoT quote! '  },
        { alert : +5, message : 'Bla bla random GoT quote! '  },
        { alert : -6, message : 'Bla bla random GoT quote! '  },
        { alert : +15, message : 'Bla bla random GoT quote! '  }
    ];
    shuffleArray(randomTrap);

    for(var i = 0; i < 5; i++){
        let randomTrapNumber = Math.floor(Math.random() * (27 - 1) + 3);
        space[randomTrapNumber].trap = randomTrap[i];
    }
}

/**************************************************************
 * 
 *  FUNCTIONS FOR CHARACTER / TOKEN
 * 
 **************************************************************/
function startCharacter(){
    createRectangle(player[0].color, 40, player[0].x, player[0].y);
    createRectangle(player[1].color, 40, player[1].x, player[1].y);

    // Return new canvas along with placement of token
    return stage.update();
}

function moveCharacter(dice){
    let i = 0;
    do{
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

                let winnerMessage = player[playerTurn].name + ' WOoooooON!';
                return clearStageNoMove(), addText(winnerMessage, 'red',0,-175);
            }

            i++;
    }while(i < dice);

    if('trap' in space[player[playerTurn].dice]) {
        let newDice = player[playerTurn].dice + space[player[playerTurn].dice].trap.alert;

        if( newDice <= 0){ newDice = 1; }else if( newDice >= 30){ newDice = 30;}

        let trapMessage = 'ITS A TRAP!\n ' + space[player[playerTurn].dice].trap.message + 
        '\n You will be moved : ' + space[player[playerTurn].dice].trap.alert + ' spaces!' +
        '\n From space: ' + player[playerTurn].dice + ' to space: ' + newDice;

        
        player[playerTurn].dice = newDice;
        player[playerTurn].x = space[(player[playerTurn].dice-1)].x + 15;
        player[playerTurn].y = space[(player[playerTurn].dice-1)].y + 10;
        addText(trapMessage, 'red',0,50);
        if ( player[playerTurn].dice >= (1+total) ){
            let winnerMessage = player[playerTurn].name + ' WON!';
            return clearStageNoMove(dice),
            addText(winnerMessage, 'red',0,-175),
            addText(trapMessage, 'red',0,50);
        }
        
        createRectangle(player[playerTurn].color, 40, player[playerTurn].x, player[playerTurn].y);
    }else{
        createRectangle(player[playerTurn].color, 40, player[playerTurn].x, player[playerTurn].y);
    }
    // Place the token on the right space
    
    


    if( playerTurn == 1 ){
        playerTurn = 0; }else if( playerTurn == 0) { playerTurn = 1;  }
    // Return new canvas along with placement of token
    return stage.update(), player[playerTurn].x, player[playerTurn].y, playerTurn;
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
