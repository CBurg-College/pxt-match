/* This is a basic extension for robot matches.
 * The robot-players and arbiter must include it
 * to be able to send and respond to 'Match'-messages.
 * 
 * In the current extension the radio event handler
 * 'onReceivedNumber' stores the message in variable
 * 'MATCH' and then calls a 'matchHandler' of which
 * the code should be registered by the depending
 * arbiter and player extensions through calling
 * 'setMatchHandling' as follows:
 *              setMatchHandling(() => {
 *                  ... handling code ...
 *              })
 * The handling code should respond to the message
 * stored in the variable MATCH.
 * 
 * Additionally, the depending player extensions
 * (e.g. pxt-soccer-player) should implement a function
 * that allows to create code for the 'playerHandler',
 * e.g.:        //% color="#FFCC00"
 *              //% block="when playing"
 *              //% block.loc.nl="gedurende het spel"
 *              export function onEventOutsideField(
 *                                  programmableCode: () => void): void {
 *                  playerHandler = programmableCode;
 *              }
 */

enum Match {
    Stop,
    Start,
    PointA,
    PointB,
    DisallowA,
    DisallowB,
    WinnerA,
    WinnerB,
    DisqualA,
    DisqualB
}

let MATCH = Match.Stop
let PLAYING = false
let PAUSE = false

let matchHandler: handler   // handling match events
let playerHandler: handler  // handling player program

function setMatchHandling(programmableCode: () => void): void {
    matchHandler = programmableCode;
}

function playerProgram() {
    while (PLAYING) {
        if (PAUSE) continue
        if (playerHandler) playerHandler()
        basic.pause(1)
    }
}

function setPause() {
    PAUSE = true
}

function clearPause() {
    PAUSE = false
}

radio.onReceivedNumber(function (match: number) {
    MATCH = match
    if (MATCH == Match.Start) {
         PLAYING = true
         playerProgram()
    }
    if (MATCH == Match.Stop) PLAYING = false
    if (matchHandler) matchHandler()
})
