if( sessionStorage.getItem('winner') && sessionStorage.getItem('winner-player') ){

    document.getElementById('winner').innerHTML = `
    <div class="col-sm-12 mx-auto text-center" style="margin-top: 2rem;">
        <img src="_assets/shield.png" alt="A Shield" class="imageOverlayShield">
    </div>
    <div class="col-sm-12 mx-auto text-center" style="margin-top: 0;">
        <h1>` + sessionStorage.getItem('winner') + `</h1>
        <h4>` + sessionStorage.getItem('winner-player') + `</h4>
        <h5>You've reached the end of your quest!<br>
            Congratulations on your WIN!</h5>
        <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Play Again?</a>
    </div>
    `;

}else{

    document.getElementById('winner').innerHTML = `
        <div class="col-12 mx-auto text-center" style="margin-top: 2rem;">
            <h1>Can't win without playing!</h1>>
            <a href="index.html" class="btn btn-primary" style="margin-top: 2rem;">Go Play?</a>
        </div>
    `;
}