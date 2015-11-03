var snake;

var context;
var screenWidth;
var screenHeight;

function gameInitialize() {
   var canvas = document.getElementById("game-screen");
   context = canvas.getContext("2d");
   
   screenWidth = window.innerWidth;
   screenWeight = window.innerWeight;
   
   canvas.width = screenWidth;
   canvas.height = screenWidth;
}

function gameLoop() {
    
}

function gameDraw () {
     context.fillStyle = "rgb(55, 222, 119)";
     context.fillRect(0, 0, screenWidth, screenWeight);
 }
 