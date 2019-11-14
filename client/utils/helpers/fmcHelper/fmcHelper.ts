import * as gic from '../scrambleGenerator/scramble_image_generator'
// TODO: look at https://github.com/euphwes/cubers.io/commit/e612e4d756d76ba9c450c79f5f92411ed1cffc2c#diff-bd88b2cdb67da4a1d2b45f5fe77a0122 and https://github.com/euphwes/cubers.io/issues/110 to add dnf functionality in fmc


// TODO: comment me plz

// function disallowNonDigitsAndDNF(event) {
//     var regex = new RegExp("^[0-9DNFdnf]+$");

//     var rawCode = !event.charCode ? event.which : event.charCode;
//     if (rawCode == 13) { return true; }

//     var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
//     if (!regex.test(key)) {
//         event.preventDefault();
//         return false;
//     }
// };

// Determine if a given solution solves a given scramble
export function doesSolutionSolveScramble(solution: string, scramble: string) {
    var combined_scramble_solution = scramble + ' ' + solution;
    var state_post_solution = (gic.sig(scramble, "FMC", null) as any).getCubeState(combined_scramble_solution);

    var solved_states = (gic.sig(scramble, "FMC", null) as any).getAllSolvedCubeStates();
    var solution_is_valid = false;

    solved_states.forEach((solved_state: any) => {
        if (state_post_solution == solved_state) {
            solution_is_valid = true;
        }
    })

    return solution_is_valid;
};

// Strips comments from solution lines, for common comment formats
// Examples:
//       R2 F2 L' D'  // does a thing
//       R2 F2 L' D'  \\ does a thing
//       R2 F2 L' D'  # does a thing
//       R2 F2 L' D'  - does a thing
function stripComments(line: string) {
    var commentStartIndex = -1;

    commentStartIndex = line.indexOf("/");
    if (commentStartIndex > -1) {
        return line.substr(0, commentStartIndex);
    }

    commentStartIndex = line.indexOf("\\");
    if (commentStartIndex > -1) {
        return line.substr(0, commentStartIndex);
    }

    commentStartIndex = line.indexOf("#");
    if (commentStartIndex > -1) {
        return line.substr(0, commentStartIndex);
    }

    commentStartIndex = line.indexOf("-");
    if (commentStartIndex > -1) {
        return line.substr(0, commentStartIndex);
    }

    return line;
};

// Ensures the solution is written with the casing that the scramble preview generator expects
function ensureCorrectCasing(line: string) {
    // face moves and slices should be capitals
    line = line.replace(/r/g, "R");
    line = line.replace(/f/g, "F");
    line = line.replace(/l/g, "L");
    line = line.replace(/b/g, "B");
    line = line.replace(/u/g, "U");
    line = line.replace(/d/g, "D");
    line = line.replace(/e/g, "E");
    line = line.replace(/s/g, "S");
    line = line.replace(/m/g, "M");

    // rotations should be lowercase
    line = line.replace(/X/g, "x");
    line = line.replace(/Y/g, "y");
    line = line.replace(/Z/g, "z");

    return line;
};

// Strip out the comments and characters which aren't a valid solution, ensure correct casing,
// clean up errant whitespace, and return as the raw solution string
export function sanitizeSolutionAndGetRawMoves(result: string) {
    var validMoves = [
        "U", "U2", "U'",
        "F", "F2", "F'",
        "R", "R2", "R'",
        "L", "L2", "L'",
        "D", "D2", "D'",
        "B", "B2", "B'",
        "Uw", "Uw2", "Uw'",
        "Fw", "Fw2", "Fw'",
        "Rw", "Rw2", "Rw'",
        "Lw", "Lw2", "Lw'",
        "Dw", "Dw2", "Dw'",
        "Bw", "Bw2", "Bw'",
        "M", "M2", "M'",
        "S", "S2", "S'",
        "E", "E2", "E'",
        "x", "x2", "x'",
        "y", "y2", "y'",
        "z", "z2", "z'",
    ];

    var moves: string[] = [];

    var lines = result.split(/\r?\n/);

    lines.forEach(line => {
        line = line.trim();
        line = ensureCorrectCasing(line);
        line = stripComments(line);
        line = line.trim();

        if (line == '') { return; }

        line.split(" ").forEach(chunk => {

            chunk = chunk.trim();
            if (chunk == '') { return; }
            if (validMoves.indexOf(chunk) === -1) { return; }

            moves.push(chunk);
        })
    })


    return moves;
};

// Gets a move count in Outer Block Turn Metric for a given solution
export function getOBTMMoveCount(moves: string[]) {
    var sliceMoves = ["E", "E2", "E'", "M", "M2", "M'", "S", "S2", "S'"];
    var rotations = ["x", "x2", "x'", "y", "y2", "y'", "z", "z2", "z'"];

    var moveCount = 0;

    for (let move in moves) {
        if (sliceMoves.indexOf(move) !== -1) {
            moveCount += 2;
        } else if (rotations.indexOf(move) !== -1) {
            moveCount += 0;
        } else {
            moveCount += 1;
        }
    }

    return moveCount;
};