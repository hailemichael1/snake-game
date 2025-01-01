const playBoard = document.querySelector(".play-bord");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".control i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
//geating high score from local storage 
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
const changeFoodPosition = () => {
    //passing a randome 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const handleGameOver = () => {
    //clearing the time and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press Ok to replay...");
    location.reload();
}
const changDirection = (e) => {
    //changing velocity valeu based on key press 
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }

}
controls.forEach(key => {
    //calling change direction on each key cklick and passing key dataset value as an object  
    key.addEventListener("click", () => changDirection({ key: key.dataset.key }));
});
const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    // chacking the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // pusihing food position to snake body ary
        score++; // incriment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    for (i = snakeBody.length - 1; i > 0; i--) {
        // shifting the value of the elements in the snake body by one 
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; //string first element of snake body to current snake position 
    //updatfing the snakes head position based on the curent velocity 
    snakeX += velocityX;
    snakeY += velocityY;
    // chacking if teh snake head is out of wall, if so sitting game over is true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
    for (i = 0; i < snakeBody.length; i++) {
        //addinf dev fore each part of snake body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // chacking if teh snake head hit the body, if so sitting game over is true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changDirection);