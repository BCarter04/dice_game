# Notes

Reminder: this is a long-lost update to a game done years ago.

Started 18 March 2023. One commit, then nothing, until 6 October 2026. The HTML and CSS had already been pointed at a second die and a winning-score field. The script had not caught up. These notes are the map of the finished same-table game.

## The idea

Pig is a push-your-luck dice game. You may keep rolling, but a bad face throws away what you have not banked. Two people play on one screen. There is no second device and no server.

## The two numbers

Bank, `#score-0` and `#score-1`. Kept between turns. This is the number that wins the game.

Round, `#current-0` and `#current-1`. Only exists during the current turn. A bust or a turn change sets it back to 0. Hold is the only way it becomes bank.

The bar under the bank is the bank divided by the winning score, never more than the full width.

## How a roll is made

`Math.random()` returns a number from 0 up to but not including 1. Multiply by 6, drop the fraction, add 1. That is a face from 1 to 6. It is done twice, once per die.

The face is shown by setting the image `src` to `dice-1.png` through `dice-6.png`. Those files were already in the repo. A short CSS shake replays by removing and re-adding the `rolling` class. Reading `offsetWidth` between those steps forces the browser to restart the animation.

## Why the checks are in this order

1. Either die is 1: lose the round, keep the bank, next player. A 1 and a 6 is still a bust.
2. Both dice are 6: bank becomes 0, next player. This is the two-sixes rule, written for the two dice the page already had, instead of “the last single die was also a 6”.
3. Otherwise add both faces to the round. The same player rolls again if they want.

## Hold and win

Hold refuses a round of 0, so a player cannot pass an empty turn by accident and call it a bank.

The win test runs only after a hold. Points sitting in the round do not win. That matches the original rule: first to the target on the global score.

On a win the name is replaced with Winner, the dice hide, `gamePlaying` becomes false, and the panel gets the `winner` class. Roll and hold check that flag and return immediately.

## New game

`init` runs on load and on the New game button. It zeros both banks and both rounds, gives the turn to warrior 1, shows the original names, and reads the winning-score input. Reading it here, not on every hold, means editing the box during a game cannot change the target underneath the players.

## Keys

Space is roll, H is hold, N is new game, ? toggles the notes. If the score input is focused, the handler returns so a typed number is not also a move.

## What was already there in 2023

- Two player panels, named Warrior 1 and Warrior 2 in the HTML. The old script reset those names to Player 1 and Player 2. The update keeps Warrior.
- `#dice-1` and `#dice-2`, and CSS that stacked them. The old script only touched `.dice`, so the second image never updated.
- `.final-score` input. Nothing read it.
- Win at 100, one die, bust on 1, hold to bank. That core is unchanged.

## What this update did not do

No sockets, no shared link, no second browser. That was left out on purpose.
