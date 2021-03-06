/*----------------------------------------------------------------------------------------------------------------------------
 * Variables
 * ---------------------------------------------------------------------------------------------------------------------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight; 

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var scoreboard;

var foodpic;
var pic;

var GameOver;
var grow;
var start;


/* ----------------------------------------------------------------------------------------------------------------------------
 * Executing Game Code
 * ----------------------------------------------------------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000/19);

/* ------------------------------------------------------------------------------------------------------------------------------
 * Game Functions
 * -------------------------------------------------------------------------------------------------------------------------------
 */

function gameInitialize() {
   var canvas = document.getElementById("game-screen");
   context = canvas.getContext("2d");
   
   screenWidth = window.innerWidth;
   screenHeight = window.innerHeight;
   
   canvas.width = screenWidth;
   canvas.height = screenHeight;
   
   document.addEventListener("keydown", keyboardHandler);
   
   gameOverMenu = document.getElementById("gameOver");
   centerMenuPosition(gameOverMenu);
   
   restartButton = document.getElementById("restartButton");
   restartButton.addEventListener("click", gameRestart);
   
   playHUD = document.getElementById("playHUD");
   scoreboard = document.getElementById("scoreboard");
   
   GameOver = new Audio("sounds/newgo.mp3");
   GameOver.preload = "auto";
   
   grow = new Audio("sounds/eats food.mp3");
   grow.preload = "auto";
   

   foodpic = document.getElementById("source");
   
   pic = document.getElementById("main");
   
   setState("PLAY");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
    }
}

function gameDraw() {
     context.fillStyle = "rgb(81, 150, 173)";
     context.fillRect(0, 0, screenWidth, screenHeight);   
 }
 
 function gameRestart() {
     snakeInitialize();
     foodInitialize();
     hideMenu(gameOverMenu);
     setState("PLAY");
     GameOver.pause();
     GameOver.play();
     
 }
 
 /* -----------------------------------------------------------------------------------------------------------------------
  *  Snake Functions
  * -----------------------------------------------------------------------------------------------------------------------
  */
 
function snakeInitialize() {
    snake = [];
    snakeLength = 1;
    snakeSize = 20;
    snakeDirection = "down";
    
    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
          x: index,
          y: 0
        });
    }
}

function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        
        var remainder = index % 2;
        if (remainder === 0) {
            context.fillStyle = "chocolate";
        }
        else {
            context.fillStyle = "royalblue";
        }
        
        context.strokeStyle = "yellow";
        context.strokeRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        context.lineWidth= 4;
}
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;
    
    if(snakeDirection == "down") {
        snakeHeadY++;
    }
    else if(snakeDirection == "right") {
        snakeHeadX++;
    }
    
    if(snakeDirection == "up") {
        snakeHeadY--;
    }
    else if(snakeDirection == "left"){
        snakeHeadX--;
    }
    
    
    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);
    
    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/* ----------------------------------------------------------------------------------------------------------------------
 * Food Functions
 * ----------------------------------------------------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.drawImage(foodpic, food.x * snakeSize, food.y * snakeSize, 40, 40);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}

/*------------------------------------------------------------------------------------
 * Input Functions 
 * -----------------------------------------------------------------------------------
 */

function keyboardHandler(event) {
    console.log(event);
    
    if(event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if(event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if(event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
    if(event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }
}

/* --------------------------------------------------------------------------------------
 * Collision Handling
 * --------------------------------------------------------------------------------------
 */

function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX-1 == food.x && snakeHeadY-1 == food.y || snakeHeadX+1 == food.x && snakeHeadY+1 == food.y || snakeHeadX == food.x && snakeHeadY == food.y ) {
        snake.push({
            x: 0,
            y: 0
        });
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
    foodDraw();
    setFoodPosition();
    
    grow.play();
   }  
}

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
       setState("GAME OVER");
    }
    if (snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
       setState("GAME OVER");
    }
    
}

function  checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for(var index = 1; index < snake.length; index++) {
        if(snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            setState("GAME OVER");
            return;
        }
    }
}

/*---------------------------------------------------------------------------------------
 * Game State Handling 
 *--------------------------------------------------------------------------------------- 
 */

function setState(state) {
    gameState = state;
    showMenu(state);
    GameOver.play();
}

/*-----------------------------------------------------------------------------------------
 * Menu Functions
 *----------------------------------------------------------------------------------------- 
 */
function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if(state == "PLAY") {
        displayMenu(playHUD);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function drawScoreboard() {
    scoreboard.innerHTML = "Length: " + snakeLength;
}