/*
Pig — two dice, same table.

- Two players, same device, taking turns
- Each roll uses both dice and adds to the round score
- A 1 on either die loses the round and passes the turn
- Double 6 wipes that player's banked score and passes the turn
- Hold banks the round. First to the winning score (default 100) wins
- Winning score is read when a new game starts
*/

var scores, roundScore, activePlayer, gamePlaying, winningScore;

init();

document.querySelector('.btn-roll').addEventListener('click', rollDice);
document.querySelector('.btn-hold').addEventListener('click', hold);
document.querySelector('.btn-new').addEventListener('click', init);

document.addEventListener('keydown', function (event) {
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
    }
});

function rollDice() {
    if (!gamePlaying) return;

    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    showDice('dice-1', dice1);
    showDice('dice-2', dice2);

    if (dice1 === 1 || dice2 === 1) {
        setMessage('Rolled a 1. Round lost.');
        nextPlayer();
        return;
    }

    if (dice1 === 6 && dice2 === 6) {
        scores[activePlayer] = 0;
        document.getElementById('score-' + activePlayer).textContent = '0';
        updateProgress(activePlayer);
        setMessage('Double 6. Bank wiped.');
        nextPlayer();
        return;
    }

    roundScore += dice1 + dice2;
    document.getElementById('current-' + activePlayer).textContent = roundScore;
    setMessage('Rolled ' + dice1 + ' and ' + dice2 + '.');
}

function hold() {
    if (!gamePlaying) return;
    if (roundScore === 0) {
        setMessage('Roll before you hold.');
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
        setMessage('Game over. Press New game to play again.');
    } else {
        setMessage('Banked ' + roundScore + '.');
        nextPlayer();
    }
}

function nextPlayer() {
    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    hideDice();
}

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

function updateProgress(player) {
    var pct = Math.min(100, Math.round((scores[player] / winningScore) * 100));
    document.getElementById('progress-' + player).style.width = pct + '%';
}

function setMessage(text) {
    document.getElementById('message').textContent = text;
}

function readWinningScore() {
    var parsed = parseInt(document.querySelector('.final-score').value, 10);
    if (!parsed || parsed < 20) return 100;
    return parsed;
}

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
