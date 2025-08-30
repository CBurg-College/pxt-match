/* This is a basic extension for robot matches.
 * The robot-players, goals and arbiter must include
 * it to be able to send and respond to 'Match'-messages.
 * 
 * The radio event handler 'onReceivedNumber' stores
 * the messages in variable 'MATCH'. This variable is
 * repeatedly (forever) handled in a state machine.
 * According to the value in variable MATCH, the state
 * machine calls handlers that must be registered by the
 * extensions which are based on the pxt-match extension.
 * For example, registering goes like:
 *   //% block="when playing do"
 *   export function onPlay(code: () => void) : void   {
 *       playHandler = code;
 *   }
 * Of course, a handler needs to be registered only
 * when applicable. An arbiter does not need to
 * register the playHandler.
 * 
 * IMPORTANT NOTE:
 * Extensions that are based in the pxt-match extension
 * should have the following line of code as the first
 * line of EACH loop:
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

//
// game state machine
//
basic.forever(function() {
    basic.showNumber(MATCH)
    switch (MATCH) {
        case Match.Play:
            if (playHandler) {
                if (ROLE == Role.PlayerYellow || ROLE == Role.PlayerBlue)
                    playHandler()
            }
            break
        case Match.PointYellow:
            if (pointHandler && (ROLE == Role.GoalYellow))
                pointHandler()
            MATCH = Match.Stop
            if (resetHandler) resetHandler()
            break
        case Match.PointBlue:
            if (pointHandler && (ROLE == Role.GoalBlue))
                pointHandler()
            MATCH = Match.Stop
            if (resetHandler) resetHandler()
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
            MATCH = Match.Stop
            if (resetHandler) resetHandler()
            break
        case Match.WinnerBlue:
            if (winnerHandler && (ROLE == Role.PlayerBlue))
                winnerHandler()
            if (loserHandler && (ROLE == Role.PlayerYellow))
                loserHandler()
            MATCH = Match.Stop
            if (resetHandler) resetHandler()
            break
        case Match.DisqualYellow:
            if (disqualHandler && (ROLE == Role.PlayerYellow))
                disqualHandler()
            MATCH = Match.Stop
            if (resetHandler) resetHandler()
            break
        case Match.DisqualBlue:
            if (disqualHandler && (ROLE == Role.PlayerBlue))
                disqualHandler()
            MATCH = Match.Stop
            if (resetHandler) resetHandler()
            break
    }
    OLDMATCH = MATCH
})

function active() : boolean {
    return (MATCH == Match.Play)
}

function inactive() : boolean {
    return (MATCH != Match.Play)
}

radio.onReceivedNumber(function (match: number) {
    MATCH = match
})
