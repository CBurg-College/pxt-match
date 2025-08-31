/* This is a basic extension for robot matches.
 * The robot-players, goals and arbiter must include
 * it to be able to send and respond to 'Match'-messages.
 * 
 * The radio event handler 'onReceivedNumber' stores
 * the messages in variable 'MATCH' and calls the
 * accompanying handler. Dependent extensions should
 * register the handlers, for example:
 *   //% block="when playing do"
 *   export function onPlay(code: () => void) : void   {
 *       playHandler = code;
 *   }
 * Of course, a handler needs to be registered only
 * when applicable. An arbiter does not need to
 * register the playHandler.
 * 
 * IMPORTANT NOTE:
 * Dependent extensions should have the following line
 * of code as the first line of EACH loop:
 *   if (MATCH != Match.Play) return;
 * This ensures a quick response to the messages.
 */

enum Role {
    Arbiter,
    PlayerYellow,
    PlayerBlue,
    GoalYellow,
    GoalBlue
}

enum Match {
    Reset,
    Pause,
    Play,
    PointYellow,
    PointBlue,
    DisallowYellow,
    DisallowBlue,
    WinnerYellow,
    WinnerBlue,
    DisqualYellow,
    DisqualBlue
}

let MATCH: Match = Match.Reset
let OLDMATCH: Match = Match.Reset
let ROLE: Role = Role.Arbiter

let resetHandler: handler           // resetting the game
let playHandler: handler            // (re)starts playing
let pauseHandler: handler           // pauses playing
let pointYellowHandler: handler     // increase points for yellow
let pointBlueHandler: handler       // increase points for blue
let disallowYellowHandler: handler  // decrease points for yellow
let disallowBlueHandler: handler    // decrease points for blue
let winnerYellowHandler: handler    // end of game, yellow has won
let winnerBlueHandler: handler      // end of game, blue has won
let loserYellowHandler: handler     // end of game, yellow has lost
let loserBlueHandler: handler       // end of game, blue has lost
let disqualYellowHandler: handler   // end of game, yellow was disqualified
let disqualBlueHandler: handler     // end of game, blue was disqualified

basic.forever(function() {
    if ((MATCH == Match.Play) && playHandler)
        playHandler()
})

radio.onReceivedNumber(function (match: number) {
    MATCH = match
    switch (MATCH) {
        case Match.Reset:
            if (resetHandler) resetHandler()
            break
        // Match.Play is handled by dependent extensions 'if (MATCH != Match.Play) return'
        // Match.Pause is handled together with the messages below
        case Match.PointYellow:
            if (pointYellowHandler) pointYellowHandler()
            if (pauseHandler) pauseHandler()
            break
        case Match.PointBlue:
            if (pointBlueHandler) pointBlueHandler()
            if (pauseHandler) pauseHandler()
            break
        case Match.DisallowYellow:
            if (disallowYellowHandler) disallowYellowHandler()
            MATCH = OLDMATCH
            break
        case Match.DisallowBlue:
            if (disallowBlueHandler) disallowBlueHandler()
            MATCH = OLDMATCH
            break
        case Match.WinnerYellow:
            if (winnerYellowHandler) winnerYellowHandler()
            if (loserBlueHandler) loserBlueHandler()
            if (pauseHandler) pauseHandler()
            break
        case Match.WinnerBlue:
            if (winnerBlueHandler) winnerBlueHandler()
            if (loserYellowHandler) loserYellowHandler()
            if (pauseHandler) pauseHandler()
            break
        case Match.DisqualYellow:
            if (disqualYellowHandler) disqualYellowHandler()
            if (winnerBlueHandler) winnerBlueHandler()
            if (pauseHandler) pauseHandler()
            break
        case Match.DisqualBlue:
            if (disqualBlueHandler) disqualBlueHandler()
            if (winnerYellowHandler) winnerYellowHandler()
            if (pauseHandler) pauseHandler()
            break
    }
    OLDMATCH = MATCH
})
