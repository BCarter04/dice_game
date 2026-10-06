# dice_game

Reminder: this is a long-lost update to a game done years ago.

The repo was created on 18 March 2023 and left after one push. The page already showed two warriors, two dice images, and a winning-score box. `app.js` still rolled a single die and hard-coded a win at 100. It was picked back up on 6 October 2026. Still one device, same table. No local network and no internet play.

Open `index.html` in a browser. The dice pictures and the background are the original files.

## What it is

Pig with two dice. Two players share the keyboard. Each has a bank (the big number) and a round (the small number). The round is at risk. The bank is safe until a double 6.

## What a turn does

1. Roll. Both dice get a face from 1 to 6. The total is added to the round.
2. A 1 on either die loses the round only. The bank stays. The other player goes.
3. Both dice showing 6 sets that player's bank to 0 and passes the turn.
4. Hold adds the round to the bank and passes the turn. Holding on 0 does nothing.
5. If the bank is at least the winning score after a hold, that player wins. Rolls stop until New game.

The winning score is read only when New game is pressed. Default 100. Anything blank or under 20 falls back to 100. Changing the box mid-game does not move the finish line.

Space rolls, H holds, N starts over, ? hides the notes. Those keys do nothing while the score box is focused.

## What is on the screen

- Grey panel and red dot: whose turn it is.
- Big red number: bank.
- Thin bar: bank against the winning score.
- Red box: round, not banked yet.
- Two dice: last roll. Hidden when the turn ends.
- Red line under the buttons: what the last action did.
- Notes panel: the same explanation as this file, shorter. The Notes button hides it.

## Files

- `index.html` — board, reminder, notes.
- `style.css` — the original board, plus the reminder and the notes column.
- `app.js` — rules. Comments in the file walk through each function.
- `NOTES.md` — longer notes on the rules and how the script is wired.
- `dice-1.png` … `dice-6.png`, `back.jpg` — original art, unchanged.
