// API :: https://anapioficeandfire.com/ //

// Variables
const url = 'https://www.anapioficeandfire.com/api/characters/';
const characters = [583, 271, 529, 238, 1052, 148, 1022, 1560, 957, 565];
const htmlID = 'cardID';
var urlChar = '';
var key;

/***********************************
 * 
 *  fetchPromise Function
 *  fetch data from Ice and Fire API
 *
 ***********************************/
function fetchPromise(urlChar, key) {
    fetch(urlChar)
    .then((resp) => resp.json()) // Response, parse JSON.
    .then((data) => {
        // Strip the character number of the url.
        key = data.url.substring(data.url.lastIndexOf('/') + 1);

        // If character has a house attached, deliver house data.
        if(data.allegiances[0]){

            fetch(data.allegiances[0]) // Fetch from House url from Character.
                .then((resp1) => resp1.json()) // Response, parse JSON.
                .then((houseData) => { 
                    htmlCharacter(key, data.name, data.titles, data.gender, data.born, data.culture, data.died, htmlID, houseData.name, houseData.region, houseData.coatOfArms, houseData.words);
                    elementAddEvent();
                })
        // If character has no house, just deliver character data.
        }else{
            return htmlCharacter(key, data.name, data.titles, data.gender, data.born, data.culture, data.died, htmlID);
            elementAddEvent();
        }
    }) 

    // If it delivers ERROR, write to console.
    .catch((error) => console.error("FAILED: " + error)); 
}

function elementAddEvent() {
    let a = document.getElementsByClassName("clickToChoose");
    for(i = 0; i < a.length; i++){ 
        let att = a[i].getAttribute('data-characterID')
        a[i].addEventListener("click", function clicked(event) {
            console.log('You clicked: ' + att);
            event.preventDefault();
            addOverlay(att);
        });
    }
}
var player = 1;
function addOverlay(number){
    let x = document.getElementById(number);
    let y = document.getElementsByClassName("overlay");


    if( y.length >= 2 && x.classList.contains("overlay") || y.length < 2 ){
        x.classList.toggle("overlay");

        registerPlayer(number);

    } else {
        console.log("Too many players selected!");
    }
}
var inuse = 0;
function registerPlayer(number){
    console.log(player, number);

    let x = document.getElementById(number);
    if( x.lastElementChild.innerHTML == "Player2" ){
        x.removeChild(x.lastChild);
        inuse--;
        if( inuse >= 1){ player = 2; }else{ player = 1; }
        
        console.log(inuse);
    }
    else if ( x.lastElementChild.innerHTML == "Player1" ){
        x.removeChild(x.lastChild);
        inuse--;
        if( inuse >= 2){ player = 2; }else{ player = 1; }
        console.log(inuse);
    }
    else {
        var h1 = document.createElement("h1");        // Create a <button> element
        var t = document.createTextNode("Player" + player);       // Create a text node
        h1.appendChild(t);                                // Append the text to <button>
        x.appendChild(h1); 
        player++;
        if( inuse < 2 ){ inuse++; }
        
        console.log(inuse);
    }
   
}

function addPlayButton(){

}


/***********************************
 * 
 *  htmlCharacter Function
 *  Add the character Card to HTML
 *
 ***********************************/
function htmlCharacter(key, name, title, gender, born, culture, died, cardID, houseName, houseRegion, houseCOA, houseWords) {

    // Check if variables have any data attached, if they do add some formatting.
    died ? died = '<span class="characterTitle">Died</span> <span class="characterAbout">' + died + '</span>' : died = '';
    culture ? culture = '<span class="characterTitle">Culture</span> <span class="characterAbout"> ' + culture + '</span>' : culture = '';

    houseCOA ? houseCOA = '<span class="characterTitle">Coat of Arms</span> <span class="characterAbout"> ' + houseCOA + '</span>' : houseCOA = ''; 
    houseName ? houseName = '<h6 class="characterHouse">' + houseName + '</h6> ' : houseName = ''; 
    houseRegion ? houseRegion = '<span class="characterTitle">Region </span> <span class="characterAbout"> ' + houseRegion + '</span> ' : houseRegion = ''; 
    houseWords ? houseWords = '<h4 style="padding-top: 25px;">' + houseWords + '</h4>' : houseWords = ''; 
    

    // Write the given character to a HTML card - Bootstrap.
    document.getElementById(cardID).innerHTML += `
    <div class="col-xl-4 col-md-6 col-xs-12 my-3 mx-auto">
    <div id="` + key + `">
    <div class="card text-center">
    <div class="card-header">
        <h2 class="card-title text-center">` + name + `</h2>
    </div>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ key + `.png" alt="Card image" style="max-height: 150px; max-width: 150px;">
    <div class="card-body">
        
        <hr class="hr">
        `+ houseWords + `
        <p class="card-text text-left">
        <small>
        <span class="characterTitle">Titles</span> <span class="characterAbout">` + title + `</span>
        <span class="characterTitle">Gender</span> <span class="characterAbout">`+ gender + `</span>
        <span class="characterTitle">Born</span> <span class="characterAbout">`+ born + `</span>
        ` + died + `
        ` + culture + `
        </small>
        </p>
        `+ houseName + `
        <p class="card-text text-left">
        <small>
        `+ houseRegion + `
        `+ houseCOA + `
        </small>
        </p>
        
        
    </div>
    <div class="card-footer">
        <a href="#" class="btn btn-danger link w-100 clickToChoose" data-characterID="`+ key + `">Choose</a>
    </div> <!-- footer -->
    </div> <!-- card -->
    </div> <!-- overlay -->
    </div> <!-- col -->
    `;
    
}

// Print out given characters, from characters array.
for (i = 0; i <= characters.length-1; i++) {
    urlChar = 'https://www.anapioficeandfire.com/api/characters/' + characters[i];
    fetchPromise(urlChar, i);
}