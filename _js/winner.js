if( sessionStorage.getItem('winner') && sessionStorage.getItem('winner-player') ){

    document.getElementById('winner').innerHTML = `
    <div class="col-sm-12 mx-auto text-center" style="margin-top: 2rem;">
        <h1>HERE COMES THE SHIELD</h1>>
    </div>
    <div class="col-sm-12 mx-auto text-center" >
        <h1>` + sessionStorage.getItem('winner') + `E</h1>>
        <h3>` + sessionStorage.getItem('winner-player') + `</h3>
        <h5>You've reached the end of your quest!<br>
            Congratulations on your WIN!</h5>
        <a href="characters.html" class="btn btn-primary" style="margin-top: 2rem;">Play Again?</a>
    </div>
    `;

}else{

    document.getElementById('winner').innerHTML = `
        <div class="col-12 mx-auto text-center" style="margin-top: 2rem;">
            <h1>Can't win without playing!</h1>>
            <a href="characters.html" class="btn btn-primary" style="margin-top: 2rem;">Go Play?</a>
        </div>
    `;
}