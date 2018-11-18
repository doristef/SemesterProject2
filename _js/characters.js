// API :: https://anapioficeandfire.com/ //


const url = 'https://www.anapioficeandfire.com/api/characters/';
const characters = [583, 271, 529, 238, 1052, 148, 1022, 1560, 957, 565];
var urlChar = '';

// FOR HOUSES
var houseName, houseRegion, houseCOA, houseWords;

function fetchPromise(urlChar, key) {
    fetch(urlChar)
    .then((resp) => resp.json()) // Response, parse JSON
    .then((data) => {
        // console.log("---------> Success with PROMISE:  " + JSON.stringify(data, undefined, 2)) // SUCCESS, write to console
        if(data.allegiances[0]){
            fetch(data.allegiances[0])
                .then((resp1) => resp1.json()) // Response, parse JSON
                .then((houseData) => { 
                    houseName = houseData.name;
                    houseRegion = houseData.region;
                    houseCOA = houseData.coatOfArms;
                    houseWords = houseData.words;

                    return htmlCharacter(key, data.name, data.gender, data.born, data.culture, data.died, 'cardID', houseName, houseRegion, houseCOA, houseWords);
                })
        }else{
            return htmlCharacter(key, data.name, data.gender, data.born, data.culture, data.died, 'cardID', houseName, houseRegion, houseCOA, houseWords);
        }

    }) 
    .catch((error) => console.error("FAILED: " + error)); // ERROR, write to console
}



function htmlCharacter(i, name, gender, born, culture, died, cardID, houseName, houseRegion, houseCOA, houseWords) {
    var cardsHere = document.getElementById(cardID);

    if(died){ died = '<b>Died</b> ' + died + '. <br>'; } else{ died = ''; }

    
    if(houseCOA){ houseCOA = '<b>Coats of Arms</b> ' + houseCOA + '<br>'; } else { houseCOA = ''; }
    if(houseName){ houseName = '<b>' + houseName + '</b><br>'; } else { houseName = ''; }
    if(houseRegion){ houseRegion = '<b>' + houseRegion + '</b><br>'; } else { houseRegion = ''; }
    if(houseWords){ houseWords = '<h3>' + houseWords + '</h3><br>'; } else { houseWords = ''; }


    if(culture){ culture = '<b>Culture:</b> ' + culture + '<br>'; } else { culture = ''; }
    cardsHere.innerHTML += `
    <div class="col-xl-4 col-md-6 col-xs-12 my-3 mx-auto">
    <div class="card text-center" data-characterId="`+ i + `">
    <div class="card-header">
        <h2 class="card-title text-center">` + name + `</h2>
    </div>
        <img class="card-img-top mx-auto mt-4 mb-2" src="_img/`+ i + `.png" alt="Card image" style="max-height: 150px; max-width: 150px;">
    <div class="card-body">
        
        <hr class="hr">
        <h5 class="card-title text-center">` + gender + `</h5>
        <p class="card-text">
        <small>
        <b>Born</b> `+ born + `<br>
        <b><u>` + died + `</u></b>
        ` + culture + `
        </small>
        </p>
        <p class="card-text">
        <small>
        `+ houseName + `
        `+ houseRegion + `
        `+ houseCOA + `
        </small>
        </p>
        `+ houseWords + `
        
    </div>
    <div class="card-footer">
        <a href="#" class="btn btn-danger link w-100">Choose</a>
    </div>
    </div>
    </div>
    `;
    
}

for (i = 0; i <= characters.length-1; i++) {
    urlChar = 'https://www.anapioficeandfire.com/api/characters/' + characters[i];
    fetchPromise(urlChar, i);
}