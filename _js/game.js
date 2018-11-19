var throwDices = document.getElementById('throw')
throwDices.addEventListener("click", throwDice);

async function throwDice(){
    let dice = randomDice();

    // The await keyword saves us from having to write a .then() block.
    let show = await showDice(dice);
    let draw = await createCircle(dice);

    // The result of the GET request is available in the json variable.
    // We return it just like in a regular synchronous function.
    return show, draw;
}

function randomDice(){
    let dice = Math.floor(Math.random() * (6 - 1) + 1);
    return dice;
}

function showDice(dice){
    document.getElementById('diceID').innerHTML = '<img src="_assets/dice/' + dice + '.png" alt"Dice showing' + dice + '">';
}

function createCircle(key){
    var stage = new createjs.Stage("testCanvas");
    var circle = [];

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