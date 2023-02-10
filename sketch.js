//11 is the longest word
//declare/initialise global variables
let words = [];
let wordList;
let y = -32;
let start = 0;
let userInput;
let typedWord = "";
let leftOverLetters = "";
let temp;
let tempLength;
let interval;
let score = 0;
let scoreMultiplyer;
let correctlyTypedWord;

//guarantee words are loaded before game starts
function preload() {
  wordList = loadStrings('1000words.txt');
}

function setup() {
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
  //make sure game is not running as soon as page loads
  noLoop();
}

function draw() {
  background(0);
  //loop through every Word object in words and call render function
  for (let i = 0; i < words.length; i++) {
    words[i].render();
  }
  textSize(16);
  fill(0, 255, 255);
  textAlign(LEFT, TOP);
  text("Score: " + Math.round(score), 0, 0);
}

function mousePressed() {
  //start game only when userInput field is clicked
  if (mouseX >= 300 && mouseX <= 507 && mouseY >= 800 && mouseY <= 820 ) {
    userInput.value('');
    setTimeout(function() {
      loop();
    }, 3000);
    // setTimeout(increaseSpeed1, 10000);
    // setTimeout(increaseSpeed2, 20000);
    // setTimeout(increaseSpeed3, 30000);
    // setTimeout(increaseSpeed4, 40000);
    setInterval(increaseSpeed, 1000);
  }
}

//I can't believe this works
function changeColour() {
  temp = userInput.value();
  tempLength = temp.length;
  for (let i = 0; i < words.length; i++) {
    if (tempLength === 0) {
      words[i].wordColour = color(0, 255, 0);
    } else {
      for (let j = 0; j < tempLength; j++) {
        if (temp.charAt(j) === " ") {
          //do nothing
        } else if (temp.charAt(j) === words[i].word.charAt(j)) {
          words[i].wordColour = color(255, 0, 0);
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
      if (words[i].word === (typedWord) && (words[i].y >= 0 && words[i].y <= 800)) {
        //remove word object from array if user input matches word on screen
        correctlyTypedWord = words.splice(i,1);
        updateScore();
      }
    }
  }
  noInput();
}

function updateScore() {
  score = score + (correctlyTypedWord[0].word.length * (1 + correctlyTypedWord[0].speed));
}

function noInput() {
  if (userInput.value() === '') {
    for (let i = 0; i < words.length; i++) {
      words[i].wordColour = color(0, 255, 0);
    }
  }
}

function increaseSpeed() {
  for (let i = 0; i < words.length; i++) {
    words[i].speed = words[i].speed + (0.01/words[i].speed);
  }
}
