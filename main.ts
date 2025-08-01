/* This is a basic extension for robot matches.
 * The robot-players and arbiter must include it
 * to be able to send and respond to 'Match'-messages.
 * In the current extension the radio event handler
 * 'onReceivedNumber' stores the message in variable
 * 'MATCH' and then calls a 'matchHandler' of which
 * the code should be registered by the players and
 * the arbiter through calling 'setMatchHandling' as
 * follows:     setMatchHandling(() => {
 *                  ... handling code ...
 *              })
 * The handling code should respond to the message
 * stored in the variable MATCH.
 */


enum Match {
    Stop,
    Pause,
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

let matchHandler: handler   // handling match events
let playerHandler: handler  // handling player program

function setMatchHandling(programmableCode: () => void): void {
    matchHandler = programmableCode;
}

function playerProgram() {
    while (MATCH != Match.Stop) {
        if (MATCH == Match.Pause) continue
        if (playerHandler) playerHandler()
        basic.pause(1)
    }
}

radio.onReceivedNumber(function (match: number) {
    MATCH = match
    if (matchHandler) matchHandler()
})
