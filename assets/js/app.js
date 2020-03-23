// ---Global Variables---

// initialize object to contains all team data
let teams = {};
// active team
let activeTeam = {};
// active team name array. Minus spaces
let arrActiveTeamName = [];
// guesses a user has to begin each round
let guessesRemaining = 0;
// guesses per round
let guessLimit = 8;
// characters guessed incorrectly on each round of play
let incorrectCharGuesses = [];
// characters guessed correctly on each round of play
let correctCharGuesses = [];
// transition duration, used for fade animation
const transDuration = 500



// ---Functions---

// returns random number >= min and < max
const getRandNum = (min, max) => Math.floor(Math.random() * (max - min)) + min;


// deletes a property from an object
const deleteObjProp = (obj, property) => delete obj[property];


// removes duplicates from a given array
const removeArrDups = (arr) => arr.filter((val, index) => arr.indexOf(val) === index);


// restart the game
const restart = () => {
  $('#team-logo').fadeIn(transDuration, () => {
    setTimeout(() => {
      $.when($('#team-logo, #root-name, #hint-wrapper').fadeOut(transDuration))
        .done(() => initGame());
    }, 2000);
  });
};


// initialize game
const initGame = () => {

  // reset global variables
  guessesRemaining = guessLimit;
  correctCharGuesses = [];
  incorrectCharGuesses = [];

  // replenish team object if empty
  // this would be on the first round of the game or once the user has guessed every team in the league
  if (Object.keys(teams).length === 0) {
    teams = { ...mlb_data };
  }

  // clear root-name div in preparation of next round
  $('#root-name').empty();

  // select random key index from remaining teams object
  const randIndex = getRandNum(0, Object.keys(teams).length);
  // set key from teams object using random index
  const strActiveTeamName = Object.keys(teams)[randIndex];
  // set selected team object as active team
  activeTeam = teams[strActiveTeamName];
  // remove active team from teams object to prevent reselection
  deleteObjProp(teams, strActiveTeamName);

  // create an array containing all character to make up the active team's name
  // create and append divs to #root-name div 
  arrActiveTeamName = strActiveTeamName
    .split('')
    .filter(val => {
      const newDiv = $('<div>')
        .attr('data-letter', val)
        .attr('data-letter-lower', val.toLowerCase())
        .addClass('letter');

      $('#root-name').append(newDiv)

      if (val !== '_') {
        newDiv.addClass('z-depth-3')
        return val;
      }
    }).map((letter) => letter.toLowerCase());

  // set src attribute for logo
  $('#team-logo').attr('src', activeTeam.logo_url).hide();
  // display remaining guesses
  $('#remaining-guesses').text(guessesRemaining)
  // clear all letters from previous round
  $('#characters-guessed').empty()
  // populate hint
  $('#hint').text(activeTeam.location)

  // remove duplicate from array
  arrActiveTeamName = removeArrDups(arrActiveTeamName);
  $('#root-name').fadeIn(transDuration)
};


// ---Event Listeners---

// event listener for on keypress. Used to capture keys the user guesses.
$(document).on('keypress', e => {
  // record keyCode of lower case version of key pressed
  const keyCode = e.key.toLowerCase().charCodeAt(0);

  // If key pressed was a through z
  if ((e.key.length === 1) && (keyCode >= 97 && keyCode <= 122)) {

    // if guessed letter has not been guessed previously and is in team name.
    if (arrActiveTeamName.includes(e.key.toLowerCase())) {

      // loop through each letter div in the DOM and test if it should be the guessed letter.
      $('#root-name > div').each(function(index, val) {

        if ($(this).attr('data-letter-lower') === e.key.toLowerCase() && arrActiveTeamName.includes(e.key.toLowerCase())) {
          // print the letter to the div
          $(this).text($(this).attr('data-letter'))
        }
      });

      // remove the letter guessed from the array of remaining letters to guess
      const deleteIndex = arrActiveTeamName.indexOf(e.key.toLowerCase());
      arrActiveTeamName.splice(deleteIndex, 1);

      // update correctCharGuesses
      correctCharGuesses.push(e.key.toLowerCase())

      // if all letters have been guessed the user has won!
      if (arrActiveTeamName.length === 0) {
        restart()
      };
    }
    // if guessed letter has been guessed or is not in the team name
    else {

      // if letter has been guessed previously
      if (incorrectCharGuesses.includes(e.key.toLowerCase()) || correctCharGuesses.includes(e.key.toLowerCase())) {

      }
      // if this was the last guess available
      else if (guessesRemaining <= 0) {
        // game over, restart the game
        restart()
      }
      // else this guess was legit but incorrect
      else {
        guessesRemaining--

        // if user is half-way through available guesses, display a hint
        if (guessesRemaining < guessLimit * .5) {
          $('#hint-wrapper').fadeIn('slow');
        };

        // push guessed letter to capture which letters have been guessed
        incorrectCharGuesses.push(e.key.toLowerCase());
        // update guessed characters on display
        $('#characters-guessed').text(incorrectCharGuesses.join(', ').toUpperCase())
        // update remaining guesses on display
        $('#remaining-guesses').text(guessesRemaining)
      }
    };
  }
});


// Game Initialization on startup
initGame();
