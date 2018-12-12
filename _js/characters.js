// API :: https://anapioficeandfire.com/ //

/***************************************************
 * Character Variables                             *
 ***************************************************/
const url = 'https://www.anapioficeandfire.com/api/characters/';
const characters = [583, 271, 529, 238, 1052, 148, 1022, 1560, 957, 565]; // 10 characters by number
const htmlID = 'cardID';
var urlChar = '';
var key;
var inuse = 0;
var player = 1;

 /**************************************************************
  * Function fetchPromise()
  * 
  * @param {string} urlChar, url to API
  * @param {numbern} key
  * 
  * Fetch data from Ice and Fire API.
  * Fetch inside a fetch, deliver to HTML element
  * 
  *************************************************************/
function fetchPromise(urlChar, key) {
    fetch(urlChar) // urlChar given in for loop when choosing data.
    .then((resp) => resp.json()) // Response, parse JSON.
    .then((data) => {
        // Strip the character number of the url.
        key = data.url.substring(data.url.lastIndexOf('/') + 1);

        // If character has a house attached, deliver the first house data.
        if(data.allegiances[0]){

            fetch(data.allegiances[0]) // Fetch from first House url from Character.
                .then((resp1) => resp1.json()) // Response, parse JSON.
                .then((houseData) => { 
                    return htmlCharacter(key, data.name, data.titles, data.gender, data.born, data.culture, data.died, htmlID, houseData.name, houseData.region, houseData.coatOfArms, houseData.words),
                    elementAddEvent(),elementAddMoreButton(key);
                })

        // If character has no house, just deliver character data.
        }else{
            return htmlCharacter(key, data.name, data.titles, data.gender, data.born, data.culture, data.died, htmlID), 
            elementAddEvent(),elementAddMoreButton(key);
        }
    }) 

    // If it delivers ERROR, write to console.
    .catch((error) => console.error("FAILED: " + error)); 
}

 /**************************************************************
  * Function elementAddEvent()
  * 
  * Add an click Event to an Element by class name
  * 
  *************************************************************/
function elementAddEvent() {
    let a = document.getElementsByClassName("clickToChoose");

    // If elements equal to quantity of characters
    if(a.length === characters.length){
        for(i = 0; i < a.length; i++){ 
            let att = a[i].getAttribute('data-characterID')
            let attName = a[i].getAttribute('data-characterName')
            a[i].addEventListener("click", function clicked(event) {
                event.preventDefault();
                addOverlay(att, attName);
            });
        }
    }
}

 /**************************************************************
  * Function elementAddMoreButton()
  * 
  * Add an click Event to an Element by class name
  * Add an class list toggle to that Element
  * 
  *************************************************************/
function elementAddMoreButton() {
    let aboutMore = document.getElementsByClassName("aboutMore");

    // If elements equal to quantity of characters
    if(aboutMore.length === characters.length){
        for(i = 0; i < aboutMore.length; i++){ 
            let x = [];
            let att = aboutMore[i].getAttribute('data-moreButton')
            
            aboutMore[i].addEventListener("click", function clicked(event) {
                x[i] = document.getElementById("show"+att);
                event.preventDefault();
                x[i].classList.toggle('hide');
            });
        }
    }
}

 /**************************************************************
  * Function addOverlay()
  * 
  * @param {number} number
  * @param {string} name
  * 
  * Creates an overlay on clicked player, max overlay = 2
  * Toggle class list on element
  * 
  * Calls registerPlayer()
  * 
  *************************************************************/
function addOverlay(number, name){
    let x = document.getElementById(number);
    let y = document.getElementsByClassName("overlay");

    if( y.length >= 2 && x.classList.contains("overlay") || y.length < 2 ){
        x.classList.toggle("overlay");
        return registerPlayer(number, name);
    }else{
        return;
    }
}

 /**************************************************************
  * Function registerPlayer()
  * 
  * @param {number} number
  * @param {string} name
  * 
  * Add text to chosen player, writes to sessionStorage
  * Adds play button when players are chosen, 2 players
  * 
  *************************************************************/
function registerPlayer(number, name){

    let x = document.getElementById(number);
        if( x.lastElementChild.innerHTML == "Player2" ){
            x.removeChild(x.lastChild);
            inuse--;
            if( inuse >= 1){ player = 2; }else{ player = 1; }
        } 
        else if ( x.lastElementChild.innerHTML == "Player1" ){
            x.removeChild(x.lastChild);
            inuse--;
            if( inuse >= 2){ player = 2; }else{ player = 1; }
            
        } else {
            var h3 = document.createElement("h3");  
            var t = document.createTextNode("Player" + player);  
            h3.appendChild(t);       
            h3.classList.add("text-center", "py-2");
            x.appendChild(h3); 
            sessionStorage.setItem('player'+player, number);
            sessionStorage.setItem('player'+player+'Name', name);
            player++;
            if( inuse < 2 ){ inuse++; }
            if( inuse == 2){
                return showHide('playGame'); }
        }
        

}


 /**************************************************************
  * Function showHide()
  * 
  * @param {string} who
  * 
  * Gets an element, toggles display
  * DOM Element show / hide
  * 
  *************************************************************/
function showHide(who){
    let x = document.getElementById(who);
    if( x.style.display === 'none' ){
        x.style.display = 'block';
    }else{
        x.style.display = 'none';
    }
}

/**********************************************************************
 * 
 *  When user has chosen 2 players, show play button on overlay
 *
 **********************************************************************/

let chooseAgain = document.getElementById('chooseAgain');
let goPlay = document.getElementById('goPlay');

// Event listener on "Choose Again" button.
chooseAgain.addEventListener('click', function (){
    return showHide('playGame');
 });

 // Event listener on "Play Game" button. Refresh browser to PLAY
goPlay.addEventListener('click', function (){
    window.location="play.html";
 });


 /**************************************************************
  * Function htmlCharacter()
  * 
  * @param ... Loads of strings from fetch
  * 
  * Add the character Card to HTML
  * DOM Element
  * 
  *************************************************************/

function htmlCharacter(key, name, title, gender, born, culture, died, cardID, houseName, houseRegion, houseCOA, houseWords) {

    // Check if variables have any data attached, if they do add some formatting.
    died ? died = '<span class="characterTitle">Died</span> <span class="characterAbout">' + died + '</span>' : died = '';
    culture ? culture = '<span class="characterTitle">Culture</span> <span class="characterAbout"> ' + culture + '</span>' : culture = '';

    houseCOA ? houseCOA = '<span class="characterTitle">Coat of Arms</span> <span class="characterAbout"> ' + houseCOA + '</span>' : houseCOA = ''; 
    houseName ? houseName = '<h4 class="characterHouse">' + houseName + '</h4> ' : houseName = ''; 
    houseRegion ? houseRegion = '<span class="characterTitle">Region </span> <span class="characterAbout"> ' + houseRegion + '</span> ' : houseRegion = ''; 
    houseWords ? houseWords = '<h4 style="padding-top: 25px;">' + houseWords + '</h4>' : houseWords = ''; 
    

    // Write the given character to a HTML card - Bootstrap.
    document.getElementById(cardID).innerHTML += `
    <div class="col-xl-4 col-md-6 col-xs-12 my-3 mx-auto">
    <div id="` + key + `">
    <div class="card card-character text-center">
    <div class="card-header">
        <h2 class="card-title text-center">` + name + `</h2>
    </div>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ key + `.png" alt="Card image" style="max-height: 150px; max-width: 150px;">
        <button class="btn btn-secondary aboutMore" data-moreButton="`+ key + `">More</button>
    <div class="card-body hide" id="show`+ key + `">
        
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
        <hr class="hr">
        `+ houseName + `
        <p class="card-text text-left">
        <small>
        `+ houseRegion + `
        `+ houseCOA + `
        </small>
        </p>
        
    </div>

        <button class="btn btn-primary link w-100 clickToChoose" data-characterID="`+ key + `" data-characterName="`+ name + `">Choose</button>

    </div> <!-- card -->
    </div> <!-- overlay -->
    </div> <!-- col -->
    `;
}

/*****************************************************
 * Print out given characters, from characters array *
 *****************************************************/
for (i = 0; i <= characters.length-1; i++) {
    urlChar = 'https://www.anapioficeandfire.com/api/characters/' + characters[i];
    fetchPromise(urlChar, i);
}