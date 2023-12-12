//Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

//Define game variables
let gridSize = 20;
let snake = [{x:10 , y:10}]
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 350;
let gameStarted = false;

// Draw game map, snake, food
function draw(){
    board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake 
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

//Create snake or food cube/div

function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set position of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

}

// Testing Draw function
// draw();

//Draw food function
function drawFood(){
    if(gameStarted){
    const foodElement = createGameElement('div','food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
    }
}
//Generate food
function generateFood(){
    const x = Math.floor(Math.random()*gridSize)+1;
    const y = Math.floor(Math.random()*gridSize)+1;
    return {x,y};
}

//Moving the snake 

function move(){
    const head = {...snake[0]};
    switch(direction){
        case 'right' : 
            head.x++;
            break;
        case 'left' :
            head.x--;
            break;
        case 'up' :
            head.y--;
            break;
        case 'down' :
            head.y++;
            break;
    }
    snake.unshift(head); 

    // snake.pop();

    if(head.x == food.x && head.y == food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear Past Interval
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
}

//Test moving

// setInterval(() => {
//     move(); //Move first
//     draw(); //Then draw new position
// }, 250);

//Start game function
function startGame(){
    gameStarted = true; //Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress listener

function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')){
        startGame();
    }
        else{
        switch(event.key){
            case 'ArrowUp':
                if(direction == 'right' || direction == 'left') 
                direction = 'up';
            else
                direction = direction;
                break;
            case 'ArrowDown':
                if(direction == 'right' || direction == 'left') 
                direction = 'down';
            else
                direction = direction;
                break;  
            case 'ArrowLeft':
                if(direction == 'up' || direction == 'down')
                direction = 'left';
            else
                direction = direction;
                break; 
            case 'ArrowRight':
                if(direction == 'up' || direction == 'down')
                direction = 'right';
            else
                direction = direction;
                break; 
        }
    }
    }

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    // console.log(gameSpeedDelay);
    if(gameSpeedDelay>300){
        gameSpeedDelay-=6;
    } else if(gameSpeedDelay > 200){
        gameSpeedDelay -= 4;
    }
    else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 1;
    }
}

function checkCollision(){
    const head = snake[0]

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for(let i=1; i< snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y: 10}];
    food = generateFood();
    direction= 'right';
    gameSpeedDelay = 350;
    updateScore();
}
function updateScore(){
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3,'0')
}

function revealLogoAndInst(){
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    revealLogoAndInst();
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }   
    highScoreText.style.display = 'block';
    
}