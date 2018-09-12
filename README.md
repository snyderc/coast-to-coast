# Coast to Coast

Coast to Coast is a remake of the Apple IIe game "How the West Was One + Three X Four" which taught grade school students how to remember mathematical order of operations.

A live demo is available at http://coast-to-coast.snyderc.me/

## Installing

Coast to Coast is a JavaScript game and will run in a modern web browser that supports async/await. Open game.html to begin playing. The game uses several JavaScript files, listed in index.html, and uses the images in the "images" folder.

## Gameplay

You are racing your computer opponent to see whose car can travel across the country first. (Which country? Pick your favorite!) The country is represented by a grid from 0-50, where position 0 is the start and position 50 is the end.

On each turn, you are presented with three random integers -- one in the range 1-3, one in the range 0-4, and one in the range 1-7 (all ranges are inclusive). Using all three numbers, and the provided math symbols (one each of addition, subtraction, multiplication, division, and a set of parentheses), your goal is to come up with the equation whose answer gives you the best possible position on the gameboard.

The goal is to end your turn on position 50 without going over. If you would go over on a turn, you do not move that turn. If the player who started a game lands on position 50, the other player has one last turn to attempt to land on position 50 and tie the game.

Your equation can result in a positive or negative number, or in zero. An equation that equals zero is unlikely to give you an advantage, but a negative number can sometimes trigger a special feature and give you an advantage.

There are a few special features:

### Shortcuts

If you end your turn on a shortcut, you get to move ahead to the shortcut's end position.

### Rest Stops

There are four rest stops -- at positions 10, 20, 30, and 40. If you end your turn on a rest stop, you get to move ahead to the next rest stop.

### Landing on Other Player

If you end your turn on the other player's position, the other player gets sent back two rest stops. (If the other player was already at a rest stop, they are safe and do not get sent back.)

## Limitations

This version of Coast to Coast recreates the basic game logic. However, the computer player will always choose the most advantageous move to it, which results in short games if the computer gets lucky with the numbers it is assigned. The games used to go much slower when I was in elementary school and playing against the computer's "average" mode!

The original game includes plentiful age-appropriate explanatory text to walk a child through the gameplay. This version of Coast to Coast has limited explanatory text and has no in-game tutorial.

The original game also had features that allowed a user to get hints, such as whether the user can make a certain value given their three numbers, and what the computer's suggested move would be for a turn. This version of Coast to Coast provides suggested moves by outputting to the JavaScript console, but does not otherwise provide visible in-game hints.

Finally, since this version of Coast to Coast is a demonstration, there are a few bugs that have been identified that will be fixed over time. You can see those bugs in the "bugs.txt" file.

## Author

Chris Snyder

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

"How the West Was One + Three X Four" was created by Bonnie Seiler and Pat Sine, (C)1987. No copyrighted elements of the game are used in Coast to Coast.