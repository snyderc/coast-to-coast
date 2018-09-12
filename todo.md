# Bugs:
## High Priority
- PEMDAS: "(-2*2)+6" results in NaN -- but should result in "4"
- If someone puts a left parenthesis after a number, they get a free multiplication sign. Change so that when the multiplication sign is automatically added, its button is disabled so the user cannot enter a second multiplication sign.
- If you put in an equation, and the result of that equation is a non-integer, it needs to stop you (when you press = it should check for this) and tell you to try again.
## Low Priority
- When you load the Roboto font from Google, sometimes it doesn't load in time and the splash screen defaults to another font. Fix so that Roboto is used all the time.
- When cars end turn, they should be facing in the direction of forward progress. Currently, they face whichever way they last moved, even if that means they are facing "backward" when their turn ends.
- If you put in an equation, you can put a symbol at the end of the equation. Something in PEMDAS will strip away that last sign (I think) but it will still display on screen. (One solution: After someone's used all 3 numbers, they can't enter +-*/( anymore.))
- If you exceed 50 or go below 0 on a turn, show the user a message to that effect (e.g. "You can't go beyond 50!") so they know why they didn't move that turn (can use the 1st or 2nd slots for these messages).

# Feature Requests:
- Change "*" and "/" to the more familiar "x" and "÷" symbols
- Standardize between "Press Enter to Continue" and "Click to Continue" -- game uses both right now
- Allow all mouse clickable actions to be entered with keyboard keys instead
- Write help text throughout game
- Improve text display throughout game to give user more helpful feedback
- Display computer's suggested equation to user after they type in their answer
- Create a mode where the computer player chooses "moderately optimal" answers to better suit introductory grade school users.
... Should all numbers have an equal chance of being selected, even though some larger numbers give big advantages? Study the original game and see what they do.
... Determine whether there are certain combinations of numbers (3, 4, 7) not to present because they automatically can make a win (move to landmark 40 and then win).
- Look through code "TODO" flags and add them to this bug/request file
- Implement a "Backspace" feature (instead of "Clear") when entering your equation on your turn.
- In the original game, the shortcuts were assigned dynamically, instead of being hard-coded, and they would shift slightly from game to game.
- Add a more visually appealing splash screen.