/*
Pig — long-lost update, 6 October 2026.

Started 18 March 2023 and left unfinished. index.html already had two
dice images and a winning-score input. This file still rolled one die
and always won at 100. The notes below describe the finished same-table
game. There is no network play.

State
  scores         banked points, [warrior 1, warrior 2]
  roundScore     points at risk this turn, not banked yet
  activePlayer   0 or 1, the warrior who may roll or hold
  gamePlaying    false after a win, so roll and hold do nothing
  winningScore   read from the input only when a new game starts
*/

var scores, roundScore, activePlayer, gamePlaying, winningScore;

init();

document.querySelector('.btn-roll').addEventListener('click', rollDice);
document.querySelector('.btn-hold').addEventListener('click', hold);
document.querySelector('.btn-new').addEventListener('click', init);
document.getElementById('btn-notes').addEventListener('click', toggleNotes);

document.addEventListener('keydown', function (event) {
    // Do not steal keys while the winning score is being typed.
    if (event.target.classList && event.target.classList.contains('final-score')) {
        return;
    }
    if (event.code === 'Space') {
        event.preventDefault();
        rollDice();
    } else if (event.key === 'h' || event.key === 'H') {
        hold();
    } else if (event.key === 'n' || event.key === 'N') {
        init();
    } else if (event.key === '?' ) {
        toggleNotes();
    }
});

/*
Roll both dice.

Math.random() is 0 up to but not including 1. Times 6, floored, plus 1
gives a face from 1 to 6. Each face is shown by swapping the image src
to dice-N.png.

Order of the checks matters:
  1. A 1 on either die busts the round only. The bank stays.
  2. Both sixes wipe the bank, then pass the turn.
  3. Anything else is added to the round and the turn continues.
A 1 is checked first so a 1 and a 6 is a bust, not a normal add.
*/
function rollDice() {
    if (!gamePlaying) return;

    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    showDice('dice-1', dice1);
    showDice('dice-2', dice2);

    if (dice1 === 1 || dice2 === 1) {
        setMessage('Rolled a 1. The round is lost. The bank stays.');
        nextPlayer();
        return;
    }

    if (dice1 === 6 && dice2 === 6) {
        scores[activePlayer] = 0;
        document.getElementById('score-' + activePlayer).textContent = '0';
        updateProgress(activePlayer);
        setMessage('Double 6. The bank is wiped, and the turn passes.');
        nextPlayer();
        return;
    }

    roundScore += dice1 + dice2;
    document.getElementById('current-' + activePlayer).textContent = roundScore;
    setMessage('Rolled ' + dice1 + ' and ' + dice2 + '. Round is now ' + roundScore + '.');
}

/*
Hold banks the round.

The round is added to scores[activePlayer], the big number is updated,
then the win check runs. The win check is only here, not on a roll, so
you cannot win on points that have not been held. A win sets the name,
hides the dice, marks the panel, and sets gamePlaying false.
*/
function hold() {
    if (!gamePlaying) return;
    if (roundScore === 0) {
        setMessage('Roll before you hold. There is nothing to bank.');
        return;
    }

    scores[activePlayer] += roundScore;
    document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
    updateProgress(activePlayer);

    if (scores[activePlayer] >= winningScore) {
        document.getElementById('name-' + activePlayer).textContent = 'Winner!';
        hideDice();
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        gamePlaying = false;
        setMessage('Game over at ' + scores[activePlayer] + '. New game to play again.');
    } else {
        setMessage('Banked ' + roundScore + '. Bank is now ' + scores[activePlayer] + '.');
        nextPlayer();
    }
}

/*
Pass the turn.

Flips 0 and 1, zeros the round for both panels so a stale current
cannot show, and toggles the active class. Hiding the dice means the
next warrior does not inherit the last faces.
*/
function nextPlayer() {
    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    hideDice();
}

/*
Show one die.

display block reveals it. The src matches the face. Removing and
re-adding the rolling class restarts the CSS shake. Reading offsetWidth
forces a reflow so the browser treats the re-add as a new animation.
*/
function showDice(id, value) {
    var die = document.getElementById(id);
    die.style.display = 'block';
    die.src = 'dice-' + value + '.png';
    die.classList.remove('rolling');
    void die.offsetWidth;
    die.classList.add('rolling');
}

function hideDice() {
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}

/*
The bar is the bank divided by the winning score, capped at 100 so a
score past the target cannot overflow the track.
*/
function updateProgress(player) {
    var pct = Math.min(100, Math.round((scores[player] / winningScore) * 100));
    document.getElementById('progress-' + player).style.width = pct + '%';
}

function setMessage(text) {
    document.getElementById('message').textContent = text;
}

function toggleNotes() {
    document.getElementById('notes').classList.toggle('is-hidden');
}

/*
Winning score is read only from init, so a mid-game edit does not move
the finish line of the game already in progress. Missing or tiny values
fall back to the old default of 100.
*/
function readWinningScore() {
    var parsed = parseInt(document.querySelector('.final-score').value, 10);
    if (!parsed || parsed < 20) return 100;
    return parsed;
}

/*
New game.

Resets state, clears both panels, puts the active mark back on warrior
1, and locks the winning score for this game. Names go back to Warrior
1 and Warrior 2, which is what the original page used before a win
overwrote a name.
*/
function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    winningScore = readWinningScore();

    hideDice();

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Warrior 1';
    document.getElementById('name-1').textContent = 'Warrior 2';
    document.getElementById('progress-0').style.width = '0%';
    document.getElementById('progress-1').style.width = '0%';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

    setMessage('First to ' + winningScore + '. Space rolls, H holds, N starts over.');
}
