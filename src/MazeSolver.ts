interface Coords {
    x: number,
    y: number
}

type Maze = boolean[][];
type ModifiedMaze = any[][];
type ExitPath = Coords[];

// Maze for enter
const entranceMaze: Maze = [
    [false,false,false,false,true,false,false,false,false],
    [false,true,false,true,true,false,true,true,false],
    [false,true,false,false,true,false,true,false,false],
    [true,true,false,true,true,true,true,false,true],
    [false,true,false,true,false,true,false,false,false],
    [false,true,true,true,false,true,true,true,false],
    [false,false,false,false,false,false,false,false,false],
];

// Maze start coordinate
const startCoordinate = {x: 4, y:0};

/**
 * Main function to start maze exit way calculation
 *
 * @param maze - maze to calculate exit for
 * @param startPoint - maze enter coordinates
 */
function walk(maze: Maze, startPoint: Coords): ExitPath {
    const start = [startPoint.y, startPoint.x];
    const exitPoint = findExitCoordinate(maze, startPoint);

    const end = [exitPoint.y, exitPoint.x];
    const fieldMaze = numberPossibleSteps(maze, start);
    const wayInArr = formExitPath(fieldMaze, end);

    return beautifyExitPath(wayInArr);
}

/**
 *  Find exit coordinate from maze.
 *
 * @param maze - maze to calculate exit for
 * @param startPoint - maze enter coordinates
 */
function findExitCoordinate(maze: Maze, startPoint: Coords): Coords | any {
    const height = maze.length;
    const width = maze[0].length;
    //find true in extreme point of maze
    for (let y :number = 0; y < height; y++) {
        for (let x :number = 0; x < width; x++) {
            if ((y === 0 || y === height - 1 || x === 0 || x === width - 1)) {
                if (maze[y][x] == true && !(y === startPoint.y && x === startPoint.x)) {
                    return { x, y };
                }
            }
        }
    }
}

/**
 *  Number all possible steps from startPoint to endPoint.
 *
 * @param maze - maze to calculate exit for
 * @param startPoint - maze enter coordinates in array [y, x]
 */
function numberPossibleSteps(maze: ModifiedMaze, start: number[]): ModifiedMaze {
    maze[start[0]][start[1]] = 1;

    const height = maze.length;
    const width = maze[0].length;

    let queue = start;

    while (queue.length != 0) {
        let y = queue.shift();
        let x = queue.shift();
        let currentValue = parseInt(maze[y][x]);

        // Check each of the neighbours in 1 cell distance from current point (up down left right)
        for (let ny = -1; ny <= 1; ny++) {
            for (let nx = -1; nx <= 1; nx++) {

                // Neighbors couldn't stay at this points
                if (Math.abs(ny) === Math.abs(nx) || y+ny < 0 || y+ny >= height || x+nx < 0 || x+nx >= width) {
                    continue;
                }


                // If neighbour === true(not wall) - add to possible solution way
                if (maze[y+ny][x+nx] === true) {

                    maze[y+ny][x+nx] = (currentValue+1).toString();
                    queue.push(y+ny);
                    queue.push(x+nx);
                }
            }
        }
    }

    return maze;
}

/**
 *  From the end point of maze form correct
 *
 * @param maze - maze to calculate exit for
 * @param end - maze exit coordinates in array [y, x]
 */
function formExitPath(maze: ModifiedMaze, end: number[]): number[][] {
    let height = maze.length;
    let width = maze[0].length;

    let currentStep = parseInt( <string>maze[end[0]][end[1]] );
    const resultWay = [];
    resultWay.push(end);

    while (currentStep > 1) {
        let y = end[0];
        let x = end[1];
        let finishStep = false;

        // If checking all neighbours this could be max(y-1,0):min(y+1,height)
        for(let ny = -1; ny <= 1; ny++) {
            for(let nx = -1; nx <= 1; nx++) {
                if (Math.abs(ny) == Math.abs(nx) || y+ny < 0 || y+ny >= height || x+nx < 0 || x+nx >= width ) {
                    continue;
                }

                if (maze[y+ny][x+nx] == (currentStep-1).toString()) {
                    end = [y+ny, x+nx];
                    currentStep = parseInt( maze[end[0]][end[1]] );
                    resultWay.push(end);
                    finishStep = true;
                    break;
                }
            }
            if (finishStep) {
                break;
            }
        }
    }

    return resultWay.reverse();
}

/**
 *  Form path in format [{x, y}, {x, y}]
 *
 * @param pathArray - array of steps in format [[y, x], [y, x]] from maze start point to end point
 */
function beautifyExitPath(pathArray: number[][]): ExitPath {
    const correctWay: ExitPath = [];

    pathArray.forEach(step => {
        correctWay.push({x: step[0], y: step[1]})
    })

    return correctWay
}

const exitWay = walk(entranceMaze, startCoordinate);

console.log(`Maze for solving ${JSON.stringify(entranceMaze)}`);
console.log('=======================================');
console.log(`Maze start point coordinate ${JSON.stringify(startCoordinate)}`);
console.log('=======================================');
console.log('Exit Way');
console.log(exitWay);

