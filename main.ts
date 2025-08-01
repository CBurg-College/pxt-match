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
 * that allows to create code for the 'playHandler',
 * e.g.:        //% color="#FFCC00"
 *              //% block="when playing"
 *              //% block.loc.nl="gedurende het spel"
 *              export function onEventStart(
 *                                  programmableCode: () => void): void {
 *                  playHandler = programmableCode;
 *              }
 * 
 * and that allows to create code for the 'stopHandler'
 * e.g.:        //% color="#FFCC00"
 *              //% block="when stopping"
 *              //% block.loc.nl="om te stoppen"
 *              export function onEventStop(
 *                                  programmableCode: () => void): void {
 *                  stopHandler = programmableCode;
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
let RESTART = false

let matchHandler: handler   // handling match events
let playHandler: handler    // handling the play function
let stopHandler: handler    // handling the stop function

function setMatchHandling(programmableCode: () => void): void {
    matchHandler = programmableCode;
}

basic.forever(function() {
    if (inactive()) return
    RESTART = false
    if (playHandler) playHandler()
})

function active() : boolean {
    return (PLAYING && !PAUSE && !RESTART)
}

function inactive() : boolean {
    return (!PLAYING || PAUSE || RESTART)
}

function startPlaying() {
    PLAYING = true
    PAUSE = false
    RESTART = false
}

function stopPlaying() {
    PLAYING = false
    if (stopHandler) stopHandler()
}

function setPause() {
    RESTART = true
    PAUSE = true
    if (stopHandler) stopHandler()
}

function clearPause() {
    PAUSE = false
}

function restart() {
    RESTART = true
}

radio.onReceivedNumber(function (match: number) {
    MATCH = match
    switch (MATCH) {
        case Match.Start:       PLAYING = true; break;
        case Match.Stop:
        case Match.WinnerA:
        case Match.WinnerB:
        case Match.DisqualA:
        case Match.DisqualB:    PLAYING = false;
                                PAUSE = false;
                                if (stopHandler) stopHandler()
                                break;
    }
    if (matchHandler) matchHandler()
})
