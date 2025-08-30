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
    Stop,
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

let MATCH: Match = Match.Stop
let OLDMATCH: Match = Match.Stop
let ROLE: Role = Role.Arbiter

let resetHandler: handler
let playHandler: handler
let pointHandler: handler
let disallowHandler: handler
let winnerHandler: handler
let loserHandler: handler
let disqualHandler: handler

basic.forever(function() {
    if ((MATCH == Match.Play) && playHandler)
        playHandler()
})

radio.onReceivedNumber(function (match: number) {
    MATCH = match
    switch (MATCH) {
        case Match.PointYellow:
        case Match.PointBlue:
            if (ROLE == Role.Arbiter) {
                if (pointHandler) pointHandler()
            }
            else {
                if (resetHandler) resetHandler()
            }
            break
        case Match.DisallowYellow:
            if (disallowHandler && (ROLE == Role.GoalYellow))
                disallowHandler()
            MATCH = OLDMATCH
            break
        case Match.DisallowBlue:
            if (disallowHandler && (ROLE == Role.GoalBlue))
                disallowHandler()
            MATCH = OLDMATCH
            break
        case Match.WinnerYellow:
            if (winnerHandler && (ROLE == Role.PlayerYellow))
                winnerHandler()
            if (loserHandler && (ROLE == Role.PlayerBlue))
                loserHandler()
            if (resetHandler) resetHandler()
            break
        case Match.WinnerBlue:
            if (winnerHandler && (ROLE == Role.PlayerBlue))
                winnerHandler()
            if (loserHandler && (ROLE == Role.PlayerYellow))
                loserHandler()
            if (resetHandler) resetHandler()
            break
        case Match.DisqualYellow:
            if (disqualHandler && (ROLE == Role.PlayerYellow))
                disqualHandler()
            if (resetHandler) resetHandler()
            break
        case Match.DisqualBlue:
            if (disqualHandler && (ROLE == Role.PlayerBlue))
                disqualHandler()
            if (resetHandler) resetHandler()
            break
    }
    OLDMATCH = MATCH
})
