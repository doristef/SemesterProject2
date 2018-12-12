if( sessionStorage.getItem('winner') && sessionStorage.getItem('winner-player') && sessionStorage.getItem('winner-color') ){

    document.getElementById('winner').innerHTML = `
    <div class="col-sm-12 mx-auto text-center mt-5">
        <img src="_assets/shield.png" alt="A Shield" class="imageOverlayShield mb-3">
        <h1>` + sessionStorage.getItem('winner') + `</h1>
        <h4 style="color: ` + sessionStorage.getItem('winner-color') + `;">` + sessionStorage.getItem('winner-player') + `</h4>
        <h5>Reached the end of the quest.<br>
            Congratulations on the WIN!</h5>

        <a href="index.html" class="btn btn-primary my-3" style="margin-top: 1rem;">Play Again?</a>
    </div>
    `;

}else{

    document.getElementById('winner').innerHTML = `
        <div class="col-12 mx-auto text-center mt3">
            <h1>Can't win without playing!</h1>
            <a href="index.html" class="btn btn-primary" style="margin-top: 2rem;">Go Play?</a>
        </div>
    `;
}