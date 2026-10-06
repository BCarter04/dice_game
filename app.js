/*
Holdfast — long-lost update, 6 October 2026.

This is a 2016 Pig table. It was not made in 2023. The 2016 page was
uploaded to this repo on 18 March 2023 and left unfinished: two dice
images and a winning-score box were already in the HTML, and this
script still rolled one die to a hard-coded 100.

Holdfast is the 2026 name for the same game. Same table. No network.

State
  scores         banked points for this race, [left, right]
  roundScore     points at risk this turn
  activePlayer   0 or 1
  gamePlaying    false after a win
  winningScore   race length, read only when a race starts
  wins           match tally, kept in localStorage
  tape           short log of this race
*/

var scores, roundScore, activePlayer, gamePlaying, winningScore, wins, tape;

var STORE_KEY = 'holdfast-2016';

init();

document.querySelector('.btn-roll').addEventListener('click', rollDice);
document.querySelector('.btn-hold').addEventListener('click', hold);
document.querySelector('.btn-new').addEventListener('click', init);
document.getElementById('btn-notes').addEventListener('click', toggleNotes);
document.getElementById('btn-clear').addEventListener('click', clearMatch);
document.getElementById('name-0').addEventListener('change', saveSeats);
document.getElementById('name-1').addEventListener('change', saveSeats);

document.addEventListener('keydown', function (event) {
    var tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (event.code === 'Space') {
        event.preventDefault();
        rollDice();
    } else if (event.key === 'h' || event.key === 'H') {
        hold();
    } else if (event.key === 'n' || event.key === 'N') {
        init();
    } else if (event.key === '?') {
        toggleNotes();
    }
});

/*
Both dice. A 1 busts the round and keeps the bank. Double 6 wipes the
bank. Anything else is added and the seat may roll again. A 1 is
checked first so a 1 and a 6 is a bust, not a normal add.
*/
function rollDice() {
    if (!gamePlaying) return;

    var dice1 = face();
    var dice2 = face();
    showDice('dice-1', dice1);
    showDice('dice-2', dice2);
    clearFlash();

    if (dice1 === 1 || dice2 === 1) {
        mark('bust');
        setMessage(seatName(activePlayer) + ' rolled a 1. The round is lost. The bank stays.');
        addTape(seatName(activePlayer) + ' busts on ' + dice1 + ' / ' + dice2);
        nextPlayer();
        return;
    }

    if (dice1 === 6 && dice2 === 6) {
        scores[activePlayer] = 0;
        paintBank(activePlayer);
        mark('wipe');
        setMessage(seatName(activePlayer) + ' rolled double 6. The bank is wiped.');
        addTape(seatName(activePlayer) + ' wiped on 6 / 6');
        nextPlayer();
        return;
    }

    roundScore += dice1 + dice2;
    document.getElementById('current-' + activePlayer).textContent = roundScore;
    setMessage(seatName(activePlayer) + ' rolled ' + dice1 + ' and ' + dice2 + '. At risk: ' + roundScore + '.');
    addTape(seatName(activePlayer) + ' +' + (dice1 + dice2) + ' (' + dice1 + '/' + dice2 + ')');
}

function face() {
    return Math.floor(Math.random() * 6) + 1;
}

/*
Hold is the only way the round becomes bank, and the only way to win.
*/
function hold() {
    if (!gamePlaying) return;
    if (roundScore === 0) {
        setMessage('Roll before you hold. There is nothing to bank.');
        return;
    }

    var banked = roundScore;
    scores[activePlayer] += banked;
    paintBank(activePlayer);
    addTape(seatName(activePlayer) + ' holds ' + banked + ', bank ' + scores[activePlayer]);

    if (scores[activePlayer] >= winningScore) {
        wins[activePlayer] += 1;
        saveSeats();
        paintWins();
        hideDice();
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        gamePlaying = false;
        setMessage(seatName(activePlayer) + ' holds the table at ' + scores[activePlayer] + '.');
        addTape(seatName(activePlayer) + ' wins the race');
    } else {
        setMessage(seatName(activePlayer) + ' banked ' + banked + '. Bank is ' + scores[activePlayer] + '.');
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
    die.classList.remove('is-hidden');
    die.src = 'dice-' + value + '.png';
    die.classList.remove('rolling');
    void die.offsetWidth;
    die.classList.add('rolling');
}

function hideDice() {
    document.getElementById('dice-1').classList.add('is-hidden');
    document.getElementById('dice-2').classList.add('is-hidden');
}

function paintBank(player) {
    document.getElementById('score-' + player).textContent = scores[player];
    var pct = Math.min(100, Math.round((scores[player] / winningScore) * 100));
    document.getElementById('progress-' + player).style.width = pct + '%';
}

function paintWins() {
    document.getElementById('wins-0').textContent = wins[0] + (wins[0] === 1 ? ' win' : ' wins');
    document.getElementById('wins-1').textContent = wins[1] + (wins[1] === 1 ? ' win' : ' wins');
}

function seatName(player) {
    var typed = document.getElementById('name-' + player).value.replace(/^\s+|\s+$/g, '');
    return typed || (player === 0 ? 'North' : 'South');
}

function setMessage(text) {
    document.getElementById('message').textContent = text;
}

function addTape(line) {
    tape.push(line);
    if (tape.length > 6) tape.shift();
    var list = document.getElementById('tape');
    list.innerHTML = '';
    for (var i = tape.length - 1; i >= 0; i--) {
        var item = document.createElement('li');
        item.textContent = tape[i];
        list.appendChild(item);
    }
}

function mark(kind) {
    var panel = document.querySelector('.player-' + activePlayer + '-panel');
    panel.classList.add(kind);
    window.setTimeout(function () { panel.classList.remove(kind); }, 700);
}

function clearFlash() {
    document.querySelector('.player-0-panel').classList.remove('bust', 'wipe');
    document.querySelector('.player-1-panel').classList.remove('bust', 'wipe');
}

function clearMatch() {
    wins = [0, 0];
    saveSeats();
    paintWins();
    setMessage('Match count cleared. This race is unchanged.');
}

function toggleNotes() {
    document.getElementById('notes').classList.toggle('is-hidden');
}

function readWinningScore() {
    var parsed = parseInt(document.querySelector('.final-score').value, 10);
    if (!parsed || parsed < 20) return 100;
    return parsed;
}

function loadSeats() {
    var saved = { names: ['North', 'South'], wins: [0, 0] };
    try {
        var raw = localStorage.getItem(STORE_KEY);
        if (raw) saved = JSON.parse(raw);
    } catch (err) {}
    document.getElementById('name-0').value = saved.names && saved.names[0] ? saved.names[0] : 'North';
    document.getElementById('name-1').value = saved.names && saved.names[1] ? saved.names[1] : 'South';
    wins = [saved.wins && saved.wins[0] || 0, saved.wins && saved.wins[1] || 0];
    paintWins();
}

function saveSeats() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
            names: [seatName(0), seatName(1)],
            wins: wins
        }));
    } catch (err) {}
}

/*
New race. Names and match wins stay. The race length is locked here.
*/
function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    winningScore = readWinningScore();
    tape = [];
    loadSeats();

    hideDice();
    clearFlash();
    document.getElementById('tape').innerHTML = '';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('progress-0').style.width = '0%';
    document.getElementById('progress-1').style.width = '0%';
    document.getElementById('race').textContent = 'Race to ' + winningScore;

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

    setMessage('Race to ' + winningScore + '. ' + seatName(0) + ' rolls first.');
}
