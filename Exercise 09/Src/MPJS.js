<!--For introScreen-->
var startBtn = document.querySelector("#start");

startBtn.addEventListener("click",startGameHandler,false);

function startGameHandler( ) {
// Hide the intro screen, show the game screen
introScreen.style.display = "none";
gameScreen.style.display = "block";
stage.style.display = "block";
output.style.display = "block";
//gameScreen.visibility.display = "block";
}
<!--For gameScreen-->

//Get a reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

//The game map
let map =
[
  [0, 2, 0, 0, 1, 0, 0, 3],
  [0, 0, 0, 1, 0, 0, 0 ,2],
  [0, 1, 0, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 2, 0, 0, 1],
  [0, 2, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 2, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0]
];

//The game objects map
let gameObjects =
[
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0]
];

//Map code
let Soil = 0;
let Food = 1;
let Mine = 2;
let Exit = 3;
let Hero = 4;
let Villan = 5;

//The size of each cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;


//An automatic way of setting the ship's start position
var heroRow;
var heroColumn;
var villanRow;
var villanColumn;
for(var row = 0; row < ROWS; row++)
{
  for(var column = 0; column < COLUMNS; column++)
  {
    if(gameObjects[row][column] === Hero)
    {
      heroRow = row;
      heroColumn = column;
    }
    if(gameObjects[row][column] === Villan)
    {
      villanRow = row;
      villanColumn = column;
    }
  }
}

//The game variables
var food = 10;
var gold = 10;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way out of the Mine and onto Home.";


render();

function keydownHandler(event)
{
  switch(event.keyCode)
  {
    case UP:

      //Find out if the ship's move will
      //be within the playing field
	    if(heroRow > 0)
	    {
	      //If it is, clear the ship's current cell
	      gameObjects[heroRow][heroColumn] = 0;

	      //Subract 1 from the ship's row
	      //to move it up one row on the map
	      heroRow--;

	      //Apply the ship's new updated position to the array
	      gameObjects[heroRow][heroColumn] = Hero;
	    }
	    break;

	  case DOWN:
	    if(heroRow < ROWS - 1)
	    {
	      gameObjects[heroRow][heroColumn] = 0;
	      heroRow++;
	      gameObjects[heroRow][heroColumn] = Hero;
	    }
	    break;

	  case LEFT:
	    if(heroColumn > 0)
	    {
	      gameObjects[heroRow][heroColumn] = 0;
	      heroColumn--;
	      gameObjects[heroRow][heroColumn] = Hero;
	    }
	    break;

	  case RIGHT:
	    if(heroColumn < COLUMNS - 1)
	    {
	      gameObjects[heroRow][heroColumn] = 0;
	      heroColumn++;
	      gameObjects[heroRow][heroColumn] = Hero;
	    }
	    break;
    }

    //find out what kind of cell the ship is on
    switch(map[heroRow][heroColumn])
    {
      case Soil:
        console.log("Soil");
        gameMessage = "Keep Mining."
        break;

      case Mine:
        //console.log("Mine");
        //gameMessage = "You hit an underground Mine."
        defuse();
        break;

      case Food:
        //console.log("Food");
        //gameMessage = "You found Food underground? ...huh"
        trade();
        break;

      case Exit:
        //console.log("Exit");
        //gameMessage = "Home free Home."
        endGame();
        break;
    }

    //Move the monster
    moveVillan();

    //Find out if the ship is touching the monster
    if(gameObjects[heroRow][heroColumn] === Villan)
    {
      endGame();
    }

    //Subtract some food each turn
    food--;

    //Find out if the ship has run out of food or gold
    if(food <= 0 || gold <= 0)
    {
      endGame();
    }


  //Render the game
  render();
}


function moveVillan()
{
  //The 4 possible directions that the monster can move
  var UP = 1;
  var DOWN = 2;
  var LEFT = 3;
  var RIGHT = 4;

  //An array to store the valid direction that
  //the monster is allowed to move in
  var validDirections = [];

  //The final direction that the monster will move in
  var direction = undefined;

  //Find out what kinds of things are in the cells
  //that surround the monster. If the cells contain water,
  //push the corresponding direction into the validDirections array
  if(villanRow > 0)
  {
    var thingAbove = map[villanRow - 1][villanColumn];
    if(thingAbove === Soil)
	  {
	    validDirections.push(UP)
	  }
  }
  if(villanRow < ROWS - 1)
  {
    var thingBelow = map[villanRow + 1][villanColumn];
    if(thingBelow === Soil)
	  {
	    validDirections.push(DOWN)
	  }
  }
  if(villanColumn > 0)
  {
    var thingToTheLeft = map[villanRow][villanColumn - 1];
    if(thingToTheLeft === Soil)
	  {
	    validDirections.push(LEFT)
	  }
  }
  if(villanColumn < COLUMNS - 1)
  {
    var thingToTheRight = map[villanRow][villanColumn + 1];
    if(thingToTheRight === Soil)
	  {
	    validDirections.push(RIGHT)
	  }
  }

  //The validDirections array now contains 0 to 4 directions that the
  //contain WATER cells. Which of those directions will the monster
  //choose to move in?

  //If a valid direction was found, Randomly choose one of the
  //possible directions and assign it to the direction variable
  if(validDirections.length !== 0)
  {
    var randomNumber = Math.floor(Math.random() * validDirections.length);
    direction = validDirections[randomNumber];
  }

  //Move the monster in the chosen direction
  switch(direction)
  {
    case UP:
      //Clear the monster's current cell
		  gameObjects[villanRow][villanColumn] = 0;
		  //Subtract 1 from the monster's row
		  villanRow--;
		  //Apply the monster's new updated position to the array
		  gameObjects[villanRow][villanColumn] = Villan;
		  break;

	  case DOWN:
	    gameObjects[villanRow][villanColumn] = 0;
		  villanRow++;
		  gameObjects[villanRow][villanColumn] = Villan;
	    break;

	  case LEFT:
	    gameObjects[villanRow][villanColumn] = 0;
		  villanColumn--;
		  gameObjects[villanRow][villanColumn] = Villan;
	    break;

	 case RIGHT:
	    gameObjects[villanRow][villanColumn] = 0;
		  villanColumn++;
		  gameObjects[villanRow][villanColumn] = Villan;
  }
}


function trade()
{
  //Figure out how much food the island has
  //and how much it should cost
  var groceryFood = experience + gold;
  var cost = Math.ceil(Math.random() * groceryFood);

  //Let the player buy food if there's enough gold
  //to afford it
  if(gold > cost)
  {
    food += groceryFood;
    gold -= cost;
    experience += 2;

    gameMessage
      = "You buy " + groceryFood + " Bread"
      + " for " + cost + " gold pieces."
  }
  else
  {
    //Tell the player if they don't have enough gold
    experience += 1;
    gameMessage = "You don't have enough gold to buy food."
  }
}


function defuse()
{
  //The ships strength
  var heroStrength = Math.ceil((food + gold) / 2);

  //A random number between 1 and the ship's strength
  var mineStrength = Math.ceil(Math.random() * heroStrength * 2);

  if(mineStrength > heroStrength)
  {
    //The pirates ransack the ship
    var stolenGold = Math.round(mineStrength / 2);
    gold -= stolenGold;

    //Give the player some experience for trying
    experience += 1;

    //Update the game message
    gameMessage
      = "You tryed to defuse the Mine but it blewUp " + stolenGold + " gold pieces."
      + " Hero's strength: " + heroStrength
      + " Mine's strength: " + mineStrength;
  }
  else
  {
    //You win the pirates' gold
    var mineGold = Math.round(mineStrength / 2);
    gold += mineGold;

    //Add some experience
    experience += 2;

    //Update the game message
    gameMessage
      = "You managed to defuse the bomb " + mineGold + " gold pieces."
      + " Hero's strength: " + heroStrength;
      + " Mine's strength: " + mineStrength;
  }
}

function endGame()
{
  if(map[heroRow][heroColumn] === Exit)
  {
    //Calculate the score
    var score = food + gold + experience;

    //Display the game message
    gameMessage
      = "You managed to dig your way out of the Hole! " + "Final Score: " + score;
  }
  else if(gameObjects[heroRow][heroColumn] === Villan)
  {
    gameMessage
      = "You have been swallowed by a monster!";
  }
  else
  {
    //Display the game message if the player has
    //run out of gold or food
    if(gold <= 0)
    {
      gameMessage += " You've run out of gold!";
    }
    else
    {
      gameMessage += " You've run out of food!";
    }

    gameMessage
      += " You died of exhaustion!";
  }

  //Remove the keyboard listener to end the game
  window.removeEventListener("keydown", keydownHandler, false);
}


function render()
{
  //Clear the stage of img tag cells
  //from the previous turn

  if(stage.hasChildNodes())
  {
    for(var i = 0; i < ROWS * COLUMNS; i++)
    {
      stage.removeChild(stage.firstChild);
    }
  }

  //Render the game by looping through the map arrays
  for(var row = 0; row < ROWS; row++)
  {
    for(var column = 0; column < COLUMNS; column++)
    {
      //Create a img tag called cell
      var cell = document.createElement("img");

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="stage"> tag
      stage.appendChild(cell);

      //Find the correct image for this map cell
      switch(map[row][column])
      {
        case Soil:
          cell.src = "../Images/Soil.png";
          break;

        case Food:
          cell.src = "../Images/Food.png";
          break;

        case Mine:
          cell.src = "../Images/Mine.png";
          break;

        case Exit:
          cell.src = "../Images/Exit.png";
          break;
      }

      //Add the ship from the gameObjects array
        switch(gameObjects[row][column])
        {
          case Hero:
            cell.src = "../Images/Hero.png";
            break;

            case Villan:
  	        cell.src = "../Images/Villan.png";
  	        break;
        }

      //Position the cell
      cell.style.top = row * SIZE + "px";
      cell.style.left = column * SIZE + "px";
    }
  }

  //Display the game message
    output.innerHTML = gameMessage;

    //Display the player's food, gold, and experience
    output.innerHTML
      += "<br>Gold: " + gold + ", Food: "
      + food + ", Experience: " + experience;

}
