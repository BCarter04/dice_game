# Notes

Reminder: this is a long-lost update to a game from 2016. It was not made in 2023.

The table is Pig, written in 2016. It was uploaded to this repo on 18 March 2023 with the second die and the winning-score box already in the page, and with a script that still rolled one die to 100. It sat there until 6 October 2026. This update finishes that page and names it Holdfast. Same table. No network.

## Why the new name

Pig is the rules. Holdfast is the decision: bank the round, or roll again and risk it. The 2016 faces and background stay. Seats start as North and South so the board is not stuck on Warrior 1 and Warrior 2. A typed name is saved in `localStorage` under `holdfast-2016`, with the match wins.

## The two numbers

Bank, `#score-0` and `#score-1`. Kept between turns. This is the race.

Round, `#current-0` and `#current-1`, labelled "At risk". Lost on a 1, lost on a double 6, banked only by Hold.

The bar is the bank divided by the race length. The line under the name is match wins, not this race. The tape is the last six events of this race.

## Roll

`Math.random()` is 0 up to but not including 1. Times 6, floored, plus 1, is a face from 1 to 6. Done twice. The 2016 files `dice-1.png` through `dice-6.png` are the faces.

Order:

1. Either die is 1: lose the round, keep the bank, flash the seat, pass the turn. A 1 and a 6 is a bust.
2. Both dice are 6: bank becomes 0, flash, pass the turn.
3. Otherwise add both faces. The same seat may roll again.

## Hold and win

Hold refuses a round of 0. The win test runs only after a hold, so points still at risk do not win. A win adds one to that seat's match count, marks the panel, and stops roll and hold until New race. The name stays in the box. It is not replaced with the word Winner.

## New race

`init` zeros the banks and the tape, gives the first roll to the left seat, and reads the race length. Names and wins are loaded, not cleared. The race length is not read on hold, so editing the box mid-race cannot move the finish line.

## What was already in the 2016 page

Two panels, two dice images, a winning-score field, bust on 1, hold to bank, first to 100. The 2023 upload did not finish the second die or the score field. This update does.

## Left out

No sockets, no shared link, no second browser.
