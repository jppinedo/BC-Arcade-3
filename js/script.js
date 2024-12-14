const arcade = { // game object
    playerName: null,
    gameSessionActive: false,
    gessingGameActive: false,
    magicBallActive: false,
    bnhActive: false,
    wins: 0,
    gamesPlayed: 0
}

const errors = { // stores all error texts
  invalidName: 'Error: Name is invalid.',
  invalidYesNo: 'Error: Only "Yes" or "No" allowed.',
  invalidNumber: 'Error: Invalid number.',
  emptyInput: 'Error: No question detected. Please write a question.',
  nullInput: 'Error: Operation canceled.',
  invalidEntry: 'Error: Invalid Entry.',
}

const prompts = { // stores all prompts texts
  game: { // game session prompts
    enterName: 'Welcome! What\'s your name?',
    endSession: 'Would you like to pick another game to play? yes/no',
    endGame: 'Would you like to keep playing this game? yes/no'
  },
  gg: { // guessing game prompts
    guessNumber: 'Guess a number between 1 and 10.',
    tooLow: 'Guess was too low, guess again.',
    tooHigh: 'Guess was too high, guess again.'
  },
  magicBall: { // magic eight ball prompts
    questionText: 'Ask a question to the Magic Eight Ball.'
  },
  bnh: { // bear ninja hunter prompts
    choose: 'Who are you: Bear, Ninja or hunter?',
  }
}

let userInput = undefined; // stores user intput globally for all games
let inputError = false; // stores input errors for all games

const reloadPage = () => { // reload the page
  window.location.reload();
}

// this function will start a loop until the prompt is "yes" or "no"
const continuePrompt = (message) => { 
  userInput = `${userInput}`; // make sure the input is a string

  // loop until input is yes or no
  while(userInput?.toLowerCase() !== 'yes' && userInput?.toLowerCase() !== 'no') {
    // set error message if needed
    const errorMessage = inputError ? errors.invalidYesNo : '';
    // prompt message from parameter and error
    userInput = prompt(`${message}\n${errorMessage}`);
    // save the error state to show it in the next cycle
    inputError = userInput?.toLowerCase() !== 'yes' && userInput?.toLowerCase() !== 'no';
  }
}

const startSession = (game) => { // runs every time a game is started

  // this loop runs if there's no player name
  while(!arcade.playerName || arcade.playerName?.trim() === '') {
    // set error message if needed
    const errorMessage = inputError ? errors.invalidName : ''
    // prompt message and error
    userInput = prompt(`${prompts.game.enterName}\n${errorMessage}`);
    // save the error state to show it in the next cycle
    inputError = !userInput || userInput?.trim() === '';
    // save the name in the game object if valid
    arcade.playerName = !inputError ? userInput : null;
  }

  // initialize the boolean in the game object
  // this will allow the game loop to run
  arcade[game] = true;
}

// set medal based in percentage of wins
const getMedal = (winPercentage) => {
  switch (true) {
    case (winPercentage >= 76): return 'silicon';
    case (winPercentage >= 51): return 'iron';
    case (winPercentage >= 26): return 'bronze';
    case (winPercentage <= 25): return 'stone';
  }
}

const getTableResults = (winPercentage) => {
  const {gamesPlayed, wins} = arcade;
  let results = '<tr>';
      results += `<td>${gamesPlayed}</td>`;
      results += `<td>${wins}</td>`;
      results += `<td>${winPercentage.toFixed(2)}%</td>`;
      results += '</tr>';
  
  return results;
}

const endSession = (game) => { // runs to stop a game
  arcade[game] = false; // set game boolean to stop the game loop
  userInput = undefined; // reset user input

  // ask to continue the global session
  continuePrompt(`${arcade.playerName}, ${prompts.game.endSession}`);

  inputError = false; // reset input error

  // disable/enable global session depending on user choice
  arcade.gameSessionActive = userInput === 'yes';

  
  if(!arcade.gameSessionActive) {
    
    // get table with results and add the html
    const winPercentage = (arcade.wins / arcade.gamesPlayed) * 100;
    document.getElementById('info-table').innerHTML = getTableResults(winPercentage);

    // get medal based on win percentage
    const medal = getMedal(winPercentage);
    // change img src attribute to load medal image
    document.getElementById('medal-image').setAttribute('src', `images/medal_${medal}.svg`);
    // set medal text
    document.getElementById('medal-text').innerHTML = `You win the ${medal} medal.`;
    // hide game buttons and show reload button
    document.getElementById('game-selection').style.display = 'none';
    document.getElementById('game-reload').style.display = 'block';
    
  }
}

function playGuessingGame() {
  startSession('gessingGameActive'); // starts this game session

  while(arcade.gessingGameActive) {
    // calculate random number
    let randomNumber = Math.floor(Math.random() * 10) +1;
    // keep track of attempts
    let guessAttempts = 1;
    userInput = null;

    console.log(randomNumber);

    // loop until guessed number
    while (parseInt(userInput) !== randomNumber) {
      // this will run the first time, or in case of invalid inputs
      if (!userInput || isNaN(parseInt(userInput))) {
        const errorMessage = inputError ? errors.invalidNumber : ''
        userInput = prompt(`${prompts.gg.guessNumber}\n${errorMessage}`);
        inputError = isNaN(parseInt(userInput));

      // this will run with valid inputs, but not correct answer
      } else {
        userInput = parseInt(prompt(randomNumber > parseInt(userInput) ? prompts.gg.tooLow : prompts.gg.tooHigh));
        inputError = isNaN(parseInt(userInput));
        // increment attempt number each cycle
        guessAttempts++;
      }
    }

    // Increment the counter of games played
    arcade.gamesPlayed ++;
    // Increment the counter of games won
    arcade.wins ++;

    // after breaking out of the loop, show the winning message!
    alert(`You guessed it in ${guessAttempts} guesses!`);
    
    continuePrompt(`${arcade.playerName}, ${prompts.game.endGame}`);

    if(userInput?.toLowerCase() === 'no') {
      endSession('gessingGameActive');
    }

    
  }
}

const playMagicBall = function() {
  startSession('magicBallActive'); // starts this game session

  let giveAnswer = false; // controls the answer / question mode

  const answers = [
    // Affirmative Answers
    'Absolutely!',
    'No doubt about it.',
    'It\'s a resounding yes.',
    'The stars say yes.',
    'All signs point to yes.',
    'You can bank on it.',
    'Definitely in your favor.',
    'The odds are excellent.',
    'It\'s looking bright.',
    'Count on it!',

    // Non-Committal Answers
    'Unclear—try again.',
    'Too soon to say.',
    'Ask later when the time feels right.',
    'The universe isn\'t sure yet.',
    'Wait and see.',

    // Negative Answers
    'Not looking good.',
    'My instincts say no.',
    'Highly unlikely.',
    'Don\'t hold your breath.',
    'The answer is no.'
  ]

  while(arcade.magicBallActive) {
    // the user cancelled the prompt  
    if(userInput === null) {
      alert(errors.nullInput); // show error
      userInput = undefined; // reset user input
      giveAnswer = false; // reset answer mode

    // input is empty
    } else if(userInput?.trim() === '') {
      alert(errors.emptyInput); // show error
      userInput = undefined; // reset user input
      giveAnswer = false; // reset answer mode
    
    // is answer mode, and the question is valid 
    } else if(giveAnswer) {
      // get random index
      const index = Math.floor(Math.random() * 20);
      alert(answers[index]); // show answer
      giveAnswer = false; // reset mode
      userInput = undefined;

      // Increment the counter of games played
      arcade.gamesPlayed ++;
      // Increment the counter of games won
      // Every answer is counted as a win
      arcade.wins ++;

      continuePrompt(`${arcade.playerName}, ${prompts.game.endGame}`);
      if(userInput?.toLowerCase() === 'no') {
        endSession('magicBallActive');
      }

    // input is valid, assume is a question
    } else {
      // prompt and save user input
      userInput = prompt(`${prompts.magicBall.questionText}`);
      // set answer mode to true
      giveAnswer = true;
    }
    
  }
}

const playBNH = () => {
  startSession('bnhActive'); // starts this game session

  userInput = undefined;
  const choicesArr = ['bear', 'ninja', 'hunter']; // choices array
  const outcomes = []; // all history will be stored here


  alert(`Hi ${arcade.playerName}, Let\'s play!!`);

  while (arcade.bnhActive) {
    // the user canceled the prompt  
    if(userInput === null) {
      alert(errors.nullInput); // show error alert
      userInput = undefined;

    // input is empty
    } else if(userInput?.trim() === '') {
      alert(errors.invalidEntry); // show error alert
      userInput = undefined;

    // input is "yes"
    } else if(userInput?.toLowerCase() === 'yes') {
      userInput = undefined; // set the user input var to default

    // input is "no"
    } else if(userInput?.toLowerCase() === 'no') {
      // get win and lose counts
      const wins = outcomes.filter(session => session.outcome === 'User').length;
      const loses = outcomes.filter(session => session.outcome === 'Computer').length;

      let endOutcome; // initialize outcome var

      // outcome is tie
      if(wins === loses) {
        endOutcome = 'It\'s a tie!';
      
      // outcome has a winner
      } else {
        endOutcome = wins > loses ? 'You win!!' : 'You loose :(';
      }

      let endGameText = ''; // initialize end text var

      // no errors and history is not empty
      if(outcomes.length) {
        // set outcome texts
        endGameText = `The game is over ${arcade.playerName}.`;
        endGameText += `\nYou won ${wins} times and lose ${loses} times.`;
        endGameText += `\n${endOutcome}`;
        alert(endGameText);
      } 
      
      endSession('bnhActive'); // stop game

    // the default state, show prompts
    } else if(userInput === undefined) {
      // show choice prompt
      userInput = prompt(prompts.bnh.choose);
    
    // the input is not present in the choices
    } else if(!choicesArr.includes(userInput.toLocaleLowerCase())) {
      alert(errors.invalidEntry); // show error
      userInput = undefined;
    
    // assume is a valid choice
    } else {
      
      // loop to show counter
      for(let count = 3;count >= 0;count--) {
        alert(count); // show counter
      }

      // save player choice with forced case
      const playerChoice = userInput.toLocaleLowerCase();

      // get random index (0, 1 or 2)
      const index = Math.floor(Math.random() * 3);

      // get computer choice from array by the index
      const computerChoice = choicesArr[index];
      
      // Set outcome to Tie and change it latter if there's a winner
      let outcome = 'Tie';

      // If not a tie, determine the winner
      if(playerChoice !== computerChoice) {
        switch (playerChoice) {
          case 'bear':
            // Bear wins over Ninja and looses to Hunter
            outcome = computerChoice === choicesArr[1] ? 'User' : 'Computer';
            break;
          case 'ninja':
            // Ninja wins over Hunter and looses to Bear
            outcome = computerChoice === choicesArr[2] ? 'User' : 'Computer';
            break;
          case 'hunter':
            // Hunter wins over Bear and looses to Ninja
            outcome = computerChoice === choicesArr[0] ? 'User' : 'Computer';
            break;
          default:
            // if not a tie, and no winner, there must be an error
            outcome = 'Error';
        }
      }

      // Store both outcome texts to re-use latter 
      const playerChoiceText = arcade.playerName + ', you chose ' + playerChoice + '!';
      const computerChoiceText = 'The computer chose ' + computerChoice + '!';
      
      // Set final outcome text to empy string
      let finalOutcomeText = '';

      // Set tie outcome text
      if(outcome === 'Tie') {
        finalOutcomeText = 'It\'s a tie!';
      // Set error outcome text
      } else if(outcome === 'Error') {
        finalOutcomeText = 'Invalid choice, please try again!';
      // Set win/loose outcome text
      } else {
        finalOutcomeText = outcome === 'User' ? 'You win!!' : 'You loose :(';
        // Increment the counter of games won if the player actually won the game
        arcade.wins = outcome === 'User' ? arcade.wins + 1 : arcade.wins;
      }

      // save the outcome to history
      outcomes.push({
        player: playerChoice,
        computer: computerChoice,
        outcome
      });

      // show round outcome
      alert(`${playerChoiceText}\n${computerChoiceText}\n${finalOutcomeText}`);

      // Increment the counter of games played
      arcade.gamesPlayed ++;

      // prompt to play again or leave
      continuePrompt(`${arcade.playerName}, ${prompts.game.endGame}`);
    }
  }
}