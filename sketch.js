//declare/initialise global variables
let words = [];
let wordList;
let userInput;
let score = 0;
let correctlyTypedWord;
let lives = 3;
let laser;
let shootLaser = false;
let showScoreIncrease = false;
let wordToRemove;

//guarantee words are loaded before game starts
function preload() {
  wordList = loadStrings('1000words.txt');
}

function setup() {
  let y = -32;
  createCanvas(800, 800);
  //fill words arraylist with 1000 random words.
  for (let i = 0; i < 1000; i++) {   
    words[i] = new Word(random(wordList), y);
    //draw each word from 32 to 128 pixels above the previous so there is no overlap
    y = y - random(32, 128);
  }
  //create, size and position text field
  userInput = createInput('Click here to start');
  userInput.size(200);
  userInput.position(width/2 - 100,800);
  //call changeColour function everytime user types something in userInput
  userInput.input(changeColour);
  laser = new Laser(400);
  //make sure game is not running as soon as page loads
  noLoop();
}

function draw() {
  background(0);
  if (lives > 0) {
    //loop through every Word object in words and call render function
    for (let i = 0; i < words.length; i++) {
    words[i].render();
    }
    //only render laser if word typed correctly
    if (shootLaser === true) {
      //stop rendering previous words score
      showScoreIncrease = false;
      //align laser to center of the word it targets
      laser.x = correctlyTypedWord.x;
      //display and move laser
      laser.render();
      //detect if laser has hit word
      if (words[wordToRemove].y - laser.y > - 32) {
        //remove word once laser hits
        words.splice(wordToRemove, 1);
        //reset laser to use again
        laser.y = 800;
        //prevent re-entry of this loop until another word is correctly typed
        shootLaser = false;
        //run the code to show the score for the latest typed word
        showScoreIncrease = true;
      }
    }
    if (showScoreIncrease === true) {
      showWordScore();
    }
    //display score and live on screen
    displayScore(0, 0, 16);
    displayLives();
    //remove one life if word crosses threshold
    decreaseLives();
  } else {
    //display the game over screen
    gameOver();
  }
}

//---------------------------------------------------------------------------------------------------------

//show how many points the most recent correctly typed word gave you
function showWordScore() {
  textSize(15);
  noStroke();
  fill(0,255,0);
  correctlyTypedWord.y = correctlyTypedWord.y - 1;
  text("+" + Math.round(correctlyTypedWord.word.length * (1 + correctlyTypedWord.speed)), correctlyTypedWord.x, correctlyTypedWord.y);
}

//display remaining lives
function displayLives() {
  textSize(16);
  fill(0, 255, 255);
  textAlign(LEFT, TOP);
  text("Lives: " + lives, 0, 18);
}

//display total score
function displayScore(x, y, size) {
  textSize(size);
  fill(0, 255, 255);
  textAlign(LEFT, TOP);
  text("Score: " + score, x, y);
}

//waits for a mouse click
function mousePressed() {
  //start game only when userInput field is clicked
  if (mouseX >= 300 && mouseX <= 507 && mouseY >= 800 && mouseY <= 820 ) {
    userInput.value('');
    //give user 3 seconds before the game starts
    setTimeout(function() {
      loop();
    }, 3000);
    //increase speed of words every second
    setInterval(increaseSpeed, 1000);
  }
}

//I can't believe this works
function changeColour() {
  //get input field text and length
  let temp = userInput.value();
  let tempLength = temp.length;
  //loop through all words
  for (let i = 0; i < words.length; i++) {
    //set word colour to green if input field is empty
    if (tempLength === 0) {
      words[i].wordColour = color(0, 255, 0);
    } else {
      //loop to compare characters being typed and characters in the words on screen
      for (let j = 0; j < tempLength; j++) {
        //prevent word from flashing green before deleting it
        if (temp.charAt(j) === " ") {/*do nothing*/}
        //keep word highlighted red as long as user is typing correctly
        else if (temp.charAt(j) === words[i].word.charAt(j)) {
          words[i].wordColour = color(255, 0, 0);
        //revert word to green if user has typed incorrectly
        } else if (temp.charAt(j) !== words[i].word.charAt(j)) {
          words[i].wordColour = color(0, 255, 0);
          break;
        }
      }
    } 
  }
}

//check if user input matches a word on screen when space key is pressed
function keyReleased() {
  let typedWord;
  let leftOverLetters;
  if (key === ' ') {
    //only get user input before space was pressed
    typedWord = userInput.value().substring(0, userInput.value().indexOf(' '));
    //catch any extra characters recorded after the space if typing too fast
    leftOverLetters = userInput.value().substring(userInput.value().indexOf(' ') + 1);
    //reset userInput either to empty or to any characters left over after space key was pressed
    userInput.value(leftOverLetters);
    //uncomment this line below to see recorded inputs each time space is pressed in the console
    print(Array.from(typedWord)); 
    //Loop through all Word objects in words
    for (let i = 0; i < words.length; i++) {
      //begin shooting laser if word typed correctly
      if (words[i].word === (typedWord) && (words[i].y >= 0 && words[i].y <= 800)) {
        //store typed word index to use later
        wordToRemove = i;
        shootLaser = true;
        //store typed word itself to use later
        correctlyTypedWord = words[i];
        updateScore();
      }
    }
  }
  //revert all words to green if input field is '';
  noInput();
}

//round word score and update total score
function updateScore() {
  score = score + (Math.round(correctlyTypedWord.word.length * (1 + correctlyTypedWord.speed)));
}

//function to revert all words to green if input field is '';
function noInput() {
  if (userInput.value() === '') {
    for (let i = 0; i < words.length; i++) {
      words[i].wordColour = color(0, 255, 0);
    }
  }
}

//increase the speed of the falling words
function increaseSpeed() {
  for (let i = 0; i < words.length; i++) {
    //as overall speed gets faster, acceleration gets smaller
    words[i].speed = words[i].speed + (0.02/words[i].speed);
  }
}

//remove a life from player when a word crosses the threshold
function decreaseLives() {
  for (let i = 0; i < words.length; i++) {
    if (words[i].y > 800) {
      //remove word from array if not typed and crosses threshold
      words.splice(i,1);
      if (lives >  0) {
        lives--;
      }
    }
  }
}

//instructions to draw the game over screen
function gameOver() {
  fill (0, 255, 0);
  textAlign(CENTER, TOP);
  textSize(50);
  text("GAME OVER", 400, 375);
  displayScore(250, 425, 50);
}