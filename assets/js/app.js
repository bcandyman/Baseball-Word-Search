// ---Global Variables---

// copy of all teams data
const copiedMlbData = { ...mlb_data };
// active team
let selectedTeam = {};
// active team name
let selectedTeamName = [];
// guesses a user has to begin each round
let guessesRemaining = 0;


// ---Functions---

// returns random number >= min and < max
const getRandNum = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// deletes a property from an object
const deleteObjProp = (obj, property) => delete obj[property];

// returns a random property from a given object.
// returned property will be deleted from given object.
const selectRandomProp = (obj) => {
  const randIndex = getRandNum(0, Object.keys(obj).length);
  const selectedKey = Object.keys(obj)[randIndex];
  selectedProperty = obj[selectedKey];
  deleteObjProp(obj, selectedKey);
  return selectedProperty;
};


// removes duplicates from a given array
const removeDuplicateVals = (arr) => {
  return arr.filter((val, index) => arr.indexOf(val) === index);
};


// initialize the game to start and after guessing each team
const initTeamName = (selectedTeam) => {
  selectedTeamName = selectedTeam.name
    .replace(' ', '')
    .split('')
    .map(val => {
      $('#root-name').append($('<div>')
        .attr('data-letter', val)
        .attr('data-letter-lower', val.toLowerCase())
        .addClass('letter'));
      return val.toLowerCase();
    });

  selectedTeamName = removeDuplicateVals(selectedTeamName);
};


// initialize game
const initGame = () => {
  guessesRemaining = 8;
  $('#root-name').empty();
  selectedTeam = selectRandomProp(copiedMlbData);
  initTeamName(selectedTeam);
};


// ---Event Listeners---

// event listener for on keypress. Used to capture keys the user guesses.
$(document).on('keypress', e => {

  // if guessed letter has not been guessed previously and is in team name.
  if (selectedTeamName.includes(e.key.toLowerCase())) {

    // loop through each letter div in the DOM and test if it should be the guessed letter.
    $('#root-name > div').each(function(index, val) {
      if ($(this).attr('data-letter-lower') === e.key.toLowerCase() && selectedTeamName.includes(e.key.toLowerCase())) {
        // print the letter to the div
        $(this).text($(this).attr('data-letter'))
        // remove the letter guessed from the array of remaining letters to guess
        const deleteIndex = selectedTeamName.indexOf(e.key.toLowerCase());
        selectedTeamName.splice(deleteIndex, 1);
      }
    });

    // if all letters have been guessed the user has won!
    if (selectedTeamName.length === 0) {
      initGame()
    }
  }
  // if guessed letter has been guessed or is not in the team name
  else {

    console.log('No Go!!');
    guessesRemaining--
    if (guessesRemaining < 0) {
      console.log('GAME OVER!!');
      initGame()
    }
    else {
      console.log(guessesRemaining);
    }
  };
});


// Game Initialization

initGame();
