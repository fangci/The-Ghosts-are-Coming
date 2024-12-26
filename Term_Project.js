let gamecontainer = document.getElementById("gamecontainer");
const centerX= gamecontainer.offsetWidth/2;
const centerY= gamecontainer.offsetHeight/2;
const rangeleft= centerX- 20, rangeright= centerX+ 20, rangetop= centerY- 20, rangebottom= centerY+ 20;
let totalSteps= 300;
let ghost_count= 0;
let game_over= false;
let score= 0;
let highest_score= 0;
let coin_count= 0;
let character= 0;
let user_character= [0];
let intervalId, intervalId2;
let mode= 0;

function ReadMode(){
    let cookie_mode= document.cookie.split('; ').find(row => row.startsWith('mode='));
    if (cookie_mode) {
        mode = parseInt(cookie_mode.split('=')[1]);
    }
    else {
        document.cookie = 'mode=' + mode;
    }
    if(mode== 1){
        document.getElementById('mode').innerHTML= 'ON';
        document.getElementById('infinitbutton').style.backgroundColor= '#183A37';
    }
    else{
        document.getElementById('mode').innerHTML= 'OFF';
        document.getElementById('infinitbutton').style.backgroundColor= '#C44900';
    }
}

function ReadUserCharacter() {
    let userCharacter = document.cookie.split('; ').find(row => row.startsWith('user_character='));
    if (userCharacter) {
        user_character = userCharacter.split('=')[1].split(',').map(Number);
    }
    else {
        document.cookie = 'user_character=' + user_character;
    }
    let characterCookie = document.cookie.split('; ').find(row => row.startsWith('character='));
    if (characterCookie) {
        character = parseInt(characterCookie.split('=')[1]);
    }
    else {
        document.cookie = 'character=' + character;
    }
}

function AddCharacter(){
    let my_character= document.createElement('div');
    my_character.id= 'character';
    let img= document.createElement('img');
    if(character== 0) img.src= 'images_and_sounds/bird-fill.png';
    else if(character== 1) img.src= 'images_and_sounds/butterfly-fill.png';
    else if(character== 2) img.src= 'images_and_sounds/cat-fill.png';
    else if(character== 3) img.src= 'images_and_sounds/cow-fill.png';
    else if(character== 4) img.src= 'images_and_sounds/dog-fill.png';
    else if(character== 5) img.src= 'images_and_sounds/fish-simple-fill.png';
    else if(character== 6) img.src= 'images_and_sounds/horse-fill.png';
    else img.src= 'images_and_sounds/rabbit-fill.png';
    my_character.style.left= centerX+ 'px';
    my_character.style.top= centerY+ 'px';
    my_character.appendChild(img);
    gamecontainer.appendChild(my_character);
}

function showSkill(){
    let skill= document.getElementById('skill');
    if(character== 0) skill.innerHTML= 'Default';
    else if(character== 1) skill.innerHTML= 'Gain an extra life';
    else if(character== 2) skill.innerHTML= 'Slow down the ghosts';
    else if(character== 3) skill.innerHTML= 'Gain double score';
    else if(character== 4) skill.innerHTML= 'Gain 2 extra coins';
    else if(character== 5) skill.innerHTML= 'Gain 3 extra coins';
    else if(character== 6) skill.innerHTML= 'Gain 2 extra life';
    else skill.innerHTML= 'Gain double coins';
}

function AddLife(){
    let lifecontainer= document.createElement('div');
    lifecontainer.id= 'lifecontainer';
    let life_num= 3;
    if(character == 1) life_num++;
    else if(character == 6) life_num+= 2;
    for(let i=0; i<life_num; i++){
        let life= document.createElement('img');
        life.src= 'images_and_sounds/heart-fill.png';
        lifecontainer.appendChild(life);
    }
    gamecontainer.appendChild(lifecontainer);
}

function RemoveLife(){
    let lifecontainer= document.getElementById('lifecontainer');
    lifecontainer.removeChild(lifecontainer.firstChild);
    if(lifecontainer.childElementCount== 0){
        Lose();
    }
}

function AddGhost(){
    let num_ghost= (Math.random() < 0.75)? 0 : 1;
    if(character== 2) totalSteps= 500;
    else totalSteps= 300;
    let ghost_direction= [];
    let ghost_removed= false;
    let ghost= document.createElement('div');
    ghost.className= 'ghost';
    let img= document.createElement('img');
    if(num_ghost== 1) img.src= 'images_and_sounds/ghost-bold.png';
    else img.src= 'images_and_sounds/ghost-fill.png';
    let task= document.createElement('div');
    task.className= 'task';
    for(let i= 0; i< 1+ Math.floor(ghost_count/5); i++){
        let dir= Math.floor(Math.random()*4);
        let arrow= document.createElement('img');
        if(num_ghost== 1){
            if(dir==0) arrow.src= 'images_and_sounds/number-square-zero-bold.png';
            else if(dir==1) arrow.src= 'images_and_sounds/number-square-one-bold.png';
            else if(dir==2) arrow.src= 'images_and_sounds/number-square-two-bold.png';
            else arrow.src= 'images_and_sounds/number-square-three-bold.png';
        }
        else {
            if(dir==0) arrow.src= 'images_and_sounds/arrow-square-up-fill.png';
            else if(dir==1) arrow.src= 'images_and_sounds/arrow-square-right-fill.png';
            else if(dir==2) arrow.src= 'images_and_sounds/arrow-square-down-fill.png';
            else arrow.src= 'images_and_sounds/arrow-square-left-fill.png';
        }
        arrow.className= 'direction';
        task.appendChild(arrow);
        if(dir== 4) dir= 3;
        ghost_direction.push(dir);
    }
    ghost.appendChild(task);
    ghost.appendChild(img);
    gamecontainer.appendChild(ghost);

    let edge= Math.random()*4;
    edge = Math.floor(Math.random() * 4);
    let startX, startY;
    if(edge== 0){ // top
        startX= Math.random()*gamecontainer.offsetWidth;
        startY= -50;
    }
    else if(edge== 1){ // right
        startX= gamecontainer.offsetWidth+ 50;
        startY= Math.random()*gamecontainer.offsetHeight;
    }
    else if(edge== 2){ // bottom
        startX= Math.random()*gamecontainer.offsetWidth;
        startY= gamecontainer.offsetHeight+ 50;
    }
    else{ // left
        startX= -50;
        startY= Math.random()*gamecontainer.offsetHeight;
    }
    ghost.style.left= startX+ 'px';
    ghost.style.top= startY+ 'px';

    let moveX= (centerX- startX)/ totalSteps;
    let moveY= (centerY- startY)/ totalSteps;

    function moveGhost(){
        if(game_over) return;
        if(ghost_removed){
            return;
        }
        if(startX>= rangeleft && startX<= rangeright && startY>= rangetop && startY<= rangebottom){
            if(document.getElementById('lifecontainer').childElementCount!= 1){
                gamecontainer.removeChild(ghost);
            }
            ghost_sound();
            RemoveLife();
            return;
        }
        startX+= moveX;
        startY+= moveY;
        ghost.style.left= startX+ 'px';
        ghost.style.top= startY+ 'px';
        requestAnimationFrame(moveGhost);
    }

    window.addEventListener('keydown', (e)=>{
        let dir;
        if(num_ghost== 1){
            if(e.key== '0') dir= 0;
            else if(e.key== '1') dir= 1;
            else if(e.key== '2') dir= 2;
            else if(e.key== '3') dir= 3;
            else return;
        }
        else{
            if(e.key== 'ArrowUp') dir= 0;
            else if(e.key== 'ArrowRight') dir= 1;
            else if(e.key== 'ArrowDown') dir= 2;
            else if(e.key== 'ArrowLeft') dir= 3;
            else return;
        }
        if(dir== ghost_direction[0]){
            arrow_sound();
            task.removeChild(task.firstChild); // remove the first arrow
            ghost_direction.shift(); // update array
            score++;
            if(character== 3) score++;
            document.getElementById('score').innerHTML= 'Score: '+ score;
        }
        if(ghost_direction.length== 0){
            if(gamecontainer.contains(ghost)){
                gamecontainer.removeChild(ghost);
                ghost_removed= true;
            }
        }
    });

    moveGhost();
    ghost_count++;
}

function AddHeart(){
    let random= Math.random();
    if(random < 0.8) return;
    
    let heart_direction= [];
    let heart_removed= false;
    let heart= document.createElement('div');
    heart.className= 'ghost';
    let img= document.createElement('img');
    img.src= 'images_and_sounds/heart-bold.png';
    let task= document.createElement('div');
    task.className= 'task';
    for(let i= 0; i< 1+ Math.floor(ghost_count/5); i++){
        let dir= Math.floor(Math.random()*4);
        let arrow= document.createElement('img');
        if(dir==0) arrow.src= 'images_and_sounds/number-circle-zero-bold.png';
        else if(dir==1) arrow.src= 'images_and_sounds/number-circle-one-bold.png';
        else if(dir==2) arrow.src= 'images_and_sounds/number-circle-two-bold.png';
        else arrow.src= 'images_and_sounds/number-circle-three-bold.png';
        arrow.className= 'direction';
        task.appendChild(arrow);
        if(dir== 4) dir= 3;
        heart_direction.push(dir);
    }
    heart.appendChild(task);
    heart.appendChild(img);
    gamecontainer.appendChild(heart);

    let edge= Math.random()*4;
    edge = Math.floor(Math.random() * 4);
    let startX, startY;
    startX= Math.random()*gamecontainer.offsetWidth;
    startY= Math.random()*gamecontainer.offsetHeight;
    if(edge== 0){ // top
        startX= Math.random()*gamecontainer.offsetWidth;
        startY= -50;
    }
    else if(edge== 1){ // right
        startX= gamecontainer.offsetWidth+ 50;
        startY= Math.random()*gamecontainer.offsetHeight;
    }
    else if(edge== 2){ // bottom
        startX= Math.random()*gamecontainer.offsetWidth;
        startY= gamecontainer.offsetHeight+ 50;
    }
    else{ // left
        startX= -50;
        startY= Math.random()*gamecontainer.offsetHeight;
    }
    heart.style.left= startX+ 'px';
    heart.style.top= startY+ 'px';

    let moveX= (centerX- startX)/ 250;
    let moveY= (centerY- startY)/ 250;

    function moveHeart(){
        if(game_over) return;
        if(heart_removed){
            return;
        }
        if(startX>= rangeleft && startX<= rangeright && startY>= rangetop && startY<= rangebottom){
            gamecontainer.removeChild(heart);
            return;
        }
        startX+= moveX;
        startY+= moveY;
        heart.style.left= startX+ 'px';
        heart.style.top= startY+ 'px';
        requestAnimationFrame(moveHeart);
    }

    window.addEventListener('keydown', (e)=>{
        let dir;
        if(e.key== '0') dir= 0;
        else if(e.key== '1') dir= 1;
        else if(e.key== '2') dir= 2;
        else if(e.key== '3') dir= 3;
        else return;
        if(dir== heart_direction[0]){
            arrow_sound();
            task.removeChild(task.firstChild); // remove the first arrow
            heart_direction.shift(); // update array
        }
        if(heart_direction.length== 0){
            heart_removed= true;
            gamecontainer.removeChild(heart);
            let lifecontainer= document.getElementById('lifecontainer');
            let life= document.createElement('img');
            life.src= 'images_and_sounds/heart-fill.png';
            lifecontainer.appendChild(life);
        }
    });

    moveHeart();
}

function win(){
    let win= document.createElement('div');
    win.id= 'win';
    win.innerHTML= 'You Win!';
    gamecontainer.appendChild(win);
    document.getElementById('restartbutton').style.display= 'block';
    UpdateHighScore();
    UpdateCoinCount();
    document.getElementById('character').style.display= 'none';
    clearInterval(intervalId2);
}

function Lose(){
    clearInterval(intervalId);
    clearInterval(intervalId2);
    let gameover= document.createElement('div');
    gameover.id= 'gameover';
    gameover.innerHTML= 'Game Over!';
    setTimeout(()=>{
        gamecontainer.appendChild(gameover);
        UpdateHighScore();
        UpdateCoinCount();
        document.getElementById('character').style.display= 'none';
        document.getElementById('restartbutton').style.display= 'block';
    }, 500);
    game_over= true;
    let allghosts= document.getElementsByClassName('ghost');
    for(let i= 0; i< allghosts.length; i++){
        allghosts[i].style.opacity= 0.5;
    }
}

function AddScore(){
    let score_text= document.createElement('p');
    score_text.id= 'score';
    score_text.innerHTML= 'Score: 0';
    gamecontainer.appendChild(score_text);
}

function AddHighScore(){
    let highscore= document.getElementById('highscore');
    let highestScore = document.cookie.split('; ').find(row => row.startsWith('highest_score='));
    if (highestScore) {
        highest_score = parseInt(highestScore.split('=')[1]);
    }
    highscore.innerHTML = 'Highest Score: ' + highest_score;
}

function UpdateHighScore(){
    if(score> highest_score){
        highest_score= score;
        document.cookie= 'highest_score='+ highest_score;
        let highscore= document.getElementById('highscore');
        highscore.innerHTML= 'Highest Score: '+ highest_score;
    }
}

function AddCoin(){
    let coins= document.getElementById('coins');
    let coin= document.getElementById('coincount');
    let coinCount = document.cookie.split('; ').find(row => row.startsWith('coin_count='));
    if (coinCount) {
        coin_count = parseInt(coinCount.split('=')[1]);
    }
    coin.innerHTML = coin_count;
    coins.appendChild(coin);
}

function UpdateCoinCount(){
    let gain_coin= 1 + Math.floor(score/10);
    if(character== 7) gain_coin*= 2;
    if(character == 4) gain_coin+= 2;
    else if(character == 5) gain_coin+= 3;
    coin_count+= gain_coin;
    document.cookie= 'coin_count='+ coin_count;
    let coin= document.getElementById('coincount');
    coin.innerHTML= coin_count;
}

document.getElementById('startbutton').addEventListener('click', ()=>{
    document.getElementById('startscreen').style.display= 'none';
    intervalId= setInterval(AddGhost, 1000);
    intervalId2= setInterval(AddHeart, 1000);
    if(mode == 0){
        setTimeout(()=>{
            clearInterval(intervalId);
            clearInterval(intervalId);
            setTimeout(()=>{
                if(!game_over){
                    win();
                }
            }, 5000);
        }, 20000);
    }
    AddLife();
    AddScore();
    AddCharacter();
});

document.getElementById('restartbutton').addEventListener('click', ()=>{
    window.location.reload();
});

function Buy(){
    let new_ch= Math.floor(Math.random()*8);
    let treasure= document.getElementById('treasure');
    treasure.getElementsByTagName('img')[0].src= 'images_and_sounds/treasure-chest-fill.png';
    treasure.style.animation = 'shake 1.8s';
    treasure_sound();
    if (!user_character.includes(new_ch)) {
        user_character.push(new_ch);
        document.cookie = 'user_character=' + user_character;
        ShowCollection();
    }
    setTimeout(() => {
        treasure.style.animation = '';
        let new_src;
        if(new_ch== 0) new_src= 'images_and_sounds/bird-fill.png';
        else if(new_ch== 1) new_src= 'images_and_sounds/butterfly-fill.png';
        else if(new_ch== 2) new_src= 'images_and_sounds/cat-fill.png';
        else if(new_ch== 3) new_src= 'images_and_sounds/ow-fill.png';
        else if(new_ch== 4) new_src= 'images_and_sounds/dog-fill.png';
        else if(new_ch== 5) new_src= 'images_and_sounds/fish-simple-fill.png';
        else if(new_ch== 6) new_src= 'images_and_sounds/horse-fill.png';
        else new_src= 'images_and_sounds/rabbit-fill.png';
        treasure.getElementsByTagName('img')[0].src= new_src;
        let ch_imgs= document.getElementById('collection').getElementsByTagName('img');
        ch_imgs[new_ch].style.opacity= 1;
    }, 2000);
}

document.getElementById('buybutton').addEventListener('click', ()=>{
    if(coin_count>= 5){
        coin_count-= 5;
        document.cookie= 'coin_count='+ coin_count;
        let coin= document.getElementById('coincount');
        coin.innerHTML= coin_count;
        document.getElementById('buybutton').style.display= 'none';
        setTimeout(()=>{
            document.getElementById('buybutton').style.display= 'flex';
        }, 2000);
        Buy();
    }
    else{
        alert('Not enough coins!');
    }
});

document.getElementById('closebutton').addEventListener('click', ()=>{
    document.getElementById('shop').style.display= 'none';
});

document.getElementById('shopbutton').addEventListener('click', ()=>{
    document.getElementById('shop').style.display= 'block';
    let treasure= document.getElementById('treasure');
    treasure.getElementsByTagName('img')[0].src= 'images_and_sounds/treasure-chest-fill.png';
});

function ShowCollection(){
    let ch_imgs= document.getElementById('collection').getElementsByTagName('img');
    for(let i= 0; i< 8; i++){
        let img= ch_imgs[i];
        if(!user_character.includes(i)){
            img.style.opacity= 0.5;
        }
        else{
            img.style.cursor= 'pointer';
            img.addEventListener('click', ()=>{
                document.cookie= 'character='+ i;
                character= i;
                if (document.getElementById('character')) {
                    document.getElementById('character').getElementsByTagName('img')[0].src = img.src;
                }
                ChangeCharacter(i);
            });
        }
        if(i=== character){
            img.style.border= '2px solid #EFD6AC';
            img.style.borderRadius= '10px';
        }
        else{
            img.style.border= '2px solid transparent';
        }
    }
    showSkill();
}

function ChangeCharacter(ch){
    let ch_imgs= document.getElementById('collection').getElementsByTagName('img');
    for(let i= 0; i< ch_imgs.length; i++){
        ch_imgs[i].style.border= '2px solid transparent';
    }
    ch_imgs[ch].style.border= '2px solid #EFD6AC';
    ch_imgs[ch].style.borderRadius= '10px';
    showSkill();
}

function arrow_sound(){
    let audio= new Audio('images_and_sounds/sh_pickup02.mp3');
    audio.play();
}

function ghost_sound(){
    let audio;
    if(character== 0) audio= new Audio('images_and_sounds/bird.mp3');
    else if(character== 1) audio= new Audio('images_and_sounds/butterfly.mp3');
    else if(character== 2) audio= new Audio('images_and_sounds/cat.mp3');
    else if(character== 3) audio= new Audio('images_and_sounds/cow.mp3');
    else if(character== 4) audio= new Audio('images_and_sounds/dog.mp3');
    else if(character== 5) audio= new Audio('images_and_sounds/fish.mp3');
    else if(character== 6) audio= new Audio('images_and_sounds/horse.mp3');
    else audio= new Audio('images_and_sounds/rabbit.mp3');
    audio.play();
}

function treasure_sound(){
    let audio= new Audio('images_and_sounds/treasure.mp3');
    audio.play();
}

document.getElementById('bookbutton').addEventListener('click', ()=>{
    document.getElementById('book').style.display= 'block';
    ShowCollection();
});

document.getElementById('closebutton2').addEventListener('click', ()=>{
    document.getElementById('book').style.display= 'none';
});

document.getElementById('infinitbutton').addEventListener('click', ()=>{
    if(mode== 0){
        mode= 1;
    }
    else{
        mode= 0;
    }
    document.cookie= 'mode='+ mode;
    ReadMode();
});

AddCoin();
AddHighScore();
ReadUserCharacter();
ReadMode();