const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');


const blockHeight = 30;
const blockWidth = 30;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth/ blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerInveralId = null;

let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}; // generate random food

const blocks = [];
let snake = [{
    x: 1, y:3
}];

let direction = 'down';

// Grid Creation in 2-D array formate
for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render(){
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y-1};
    }else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y+1}  
    }else if(direction === 'down'){
        head = {x: snake[0].x+1, y: snake[0].y}
    }else if(direction === 'up'){
        head = {x: snake[0].x-1, y: snake[0].y}
    }

    // wall-collison logic
    if(head.x <0 || head.x >= rows || head.y <0 || head.y >=cols){
        clearInterval(intervalId);
        modal.style.display = "flex"; // Show the modal overlay
        startGameModal.style.display = "none"; // Hide start screen
        gameOverModal.style.display = "flex"; // Show game over screen
        return;
    }

    // food consumption logic(doesn't check for food spawn on snake)
    if(head.x==food.x && head.y==food.y){ 
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head); // add head(grow snake)

        score += 10;
        scoreElement.innerText = score;

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());// (localStorage only stores strings)
        }
    } 

    // This code ONLY runs when food is NOT eaten
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    // create illusion of movement
    snake.unshift(head);
    snake.pop();

    // after removing from back we need new segment at front
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

startButton.addEventListener("click",() => {
    modal.style.display = "none";
    intervalId = setInterval(() => { render() }, 300);
    timerInveralId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);

        if(sec == 59){
            min += 1;
            sec = 0;
        }else{
            sec += 1;
        }

        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000);
})

restartButton.addEventListener("click", restartGame)

function restartGame(){
    clearInterval(intervalId);
    clearInterval(timerInveralId);
    
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    score = 0;
    time = `00-00`;

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    modal.style.display = "none";
    direction = "down";
    snake = [{ x: 1, y: 3}];
    food = {
        x: Math.floor(Math.random()*rows), 
        y: Math.floor(Math.random()*cols)
    };
    intervalId = setInterval(() => { render() }, 300);
    timerInveralId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);

        if(sec == 59){
            min += 1;
            sec = 0;
        }else{
            sec += 1;
        }

        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000);
}


addEventListener("keydown",(event)=>{
    if(event.key == "ArrowUp" && direction !== "down"){
        direction = "up";
        event.preventDefault();
    }else if(event.key == "ArrowRight" && direction !== "left"){
        direction = "right";
        event.preventDefault();
    }else if(event.key == "ArrowLeft" && direction !== "right"){
        direction = "left";
        event.preventDefault();
    }else if(event.key == "ArrowDown" && direction !== "up"){
        direction = "down";
        event.preventDefault();
    }
})