# Holdfast

Reminder: this is a long-lost update to a game from 2016. It was not made in 2023.

The 2016 Pig table was uploaded to this repo on 18 March 2023 and left unfinished. The page already had two dice and a winning-score box. The script still rolled one die and always won at 100. It was finished on 6 October 2026 and renamed Holdfast. Same table. No network play.

Open `index.html`. The dice pictures and the background are the 2016 files.

## Direction

Holdfast is still Pig. The name is the decision the game is about: hold, or keep rolling and risk the round. Seats start as North and South. Type over them. Names and match wins stay on this browser.

## A race

1. Roll both dice. The total is added to the round, the number at risk.
2. A 1 on either die loses the round only. The bank stays.
3. Both dice showing 6 sets that bank to 0.
4. Hold banks the round. Holding on 0 does nothing.
5. First bank to reach the race length wins. That win is counted under the name.

The race length is read when New race is pressed. Default 100. Blank or under 20 falls back to 100.

Space rolls, H holds, N starts a race, ? hides the notes. Those keys do nothing while a name or the race box is focused.

The tape under the board is this race only. The win count is the match.

## Files

- `index.html` — board, reminder, notes.
- `style.css` — 2016 board, Holdfast title, tape, bust and wipe flash.
- `app.js` — rules, names, match tally. Comments walk through each piece.
- `NOTES.md` — longer notes.
- `dice-1.png` … `dice-6.png`, `back.jpg` — 2016 art, unchanged.
