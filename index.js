let board = [];
let humansLeft = [];
let zombiesLeft = [];

let savedHumans = 0;
let iterations = 0;

let fileData = '';

/**
 * Function to set the board array, it will also call the functions to set
 * the structures, humans and zombies, and to draw the board
 */
const setBoard = () => {
    for (let i = 0; i < 20; i++) {
        let row = []
        for (let j = 0; j < 20; j++) {
            row.push(0);
        }
        board.push(row);
    }

    setStructures();
    setHumans();
    setZombies();

    drawBoard();
}

/**
 * Function to establish the position of the structures and send them to the
 * createStructure function to place their positions in the board
 */
const setStructures = () => {
    structures = [
        [0, 0, true, 19, 'P'], //Top Wall
        [0, 0, false, 19, 'P'], //Left Wall
        [19, 0, true, 19, 'P'], //Bottom Wall
        [0, 19, false, 14, 'P'], //Right Wall
        [4, 2, true, 7, 'P'], //Top Left Zone Structure
        [4, 10, true, 16, 'P'], //Top Right Zone Structure (Horizontal)
        [4, 13, false, 7, 'P'], //Top Right Zone Structure (Vertical)
        [10, 0, true, 8, 'P'], //Middle Zone Wall (Left)
        [10, 12, true, 19, 'P'], //Middle Zone Wall (Right)
        [12, 2, true, 7, 'P'], //Bottom Left Zone Structure (Top)
        [16, 2, true, 7, 'P'], //Bottom Left Zone Structure (Bottom)
        [12, 12, false, 15, 'P'], //Bottom Right Zone Structure (Left)
        [12, 16, false, 15, 'P'], //Bottom Right Zone Structure (Right)
        [0, 3, true, 6, 'V'], //Windows (Left)
        [0, 13, true, 16, 'V'] //Windows (Right)
    ];

    structures.forEach(structure => {
        createStructure(...structure);
    });
}

/**
 * Function to set in the board the structures of the map
 * 
 * @param {Number} row : To determinate in which row is the element that wants to be placed in the board
 * @param {Number} col : To determinate in which column is the element that wants to be placed in the board
 * @param {Boolean} isRow : To determinate how the element placed will be placed. If isRow is true,
 *                          the element will be placed horizontally, else will be placed vertically
 * @param {Number} final : To determinate in which row or column finishes all the width of the element
 *                          that wants to be placed (depending of the parameter isRow)
 * @param {String} element : The type of element that wants to be placed. 'P' to place a wall
 *                           or 'V' to place a window
 */
const createStructure = (row, col, isRow, final, element) => {
    if (isRow) {
        for (let i = col; i <= final; i++) {
            board[row][i] = element;
        }
    } else {
        for (let i = row; i <= final; i++) {
            board[i][col] = element;
        }
    }
}

/**
 * Function to set the initial position of the humans
 */
const setHumans = () => {
    const humanCells = [ //Initial position of the humans
        [1, 9],
        [3, 3],
        [3, 6],
        [3, 11],
        [3, 15],
        [5, 4],
        [6, 15],
        [7, 2],
        [7, 7],
        [8, 3],
        [8, 17],
        [9, 11],
        [12, 13],
        [13, 3],
        [13, 17],
        [14, 6],
        [15, 10],
        [17, 3],
        [17, 7],
        [17, 13]
    ];

    humanCells.forEach(position => {
        board[position[0]][position[1]] = 'H'; //Set human in the board
        humansLeft.push(new Human(position[0], position[1]));
    });
}

/**
 * Function to make a random number from 1 to 8 and set in which window the zombie will appear
 */
const setZombies = () => {
    const num1 = Math.floor(Math.random() * 8 + 1);
    let num2 = Math.floor(Math.random() * 8 + 1);

    while (num1 === num2) { //If the numbers are equal, the second number will be changed until both numbers are different
        num2 = Math.floor(Math.random() * 8 + 1);
    }

    placeZombie(num1); //After the random number is created, call the placeZombie() function to set the zombie in the board
    placeZombie(num2);
}

/**
 * Function to set the zombie in the board in base a number from 1 to 8
 * 
 * @param {Number} number : A random number from 1 to 8 to set in which window the zombie will appear
 */
const placeZombie = (number) => {
    let col;
    switch (number) { //Depending the number, the zombie will be placed in the col that belongs that window
        case 1:
            col = 3;
            break;
        case 2:
            col = 4;
            break;
        case 3:
            col = 5;
            break;
        case 4:
            col = 6;
            break;
        case 5:
            col = 13;
            break;
        case 6:
            col = 14;
            break;
        case 7:
            col = 15;
            break;
        default:
            col = 16;
    }

    board[0][col] = 'Z'; //Setting the zombie in the board
    console.log(`Zombie llegó por ventana de la casilla 0, ${col}`);
    zombiesLeft.push(new Zombie([0, col]));
}

/**
 * Function draw the board array in the view
 */
const drawBoard = () => {
    for (let row = 0; row <= 19; row++) {
        $(`#row${row}`).empty();
        for (let col = 0; col <= 19; col++) {
            let cell;
            switch (board[row][col]) {
                case 'P':
                    cell = '<td class="wall"></td>';
                    break;
                case 'H':
                    cell = '<td class="human"></td>';
                    break;
                case 'I':
                    cell = '<td class="infected"></td>';
                    break;
                case 'Z':
                    cell = '<td class="zombie"></td>';
                    break;
                case 'V':
                    cell = '<td class="window"></td>';
                    break;
                default:
                    cell = '<td class="floor"></td>';
            }
            $(`#row${row}`).append(cell)
        }
    }
}

/**
 * Function to iterate and update the scenario
 */
const iterate = async () => {
    document.getElementById('btnIterate').disabled = true;

    while (humansLeft.length > 0) {
        iterations++;
        document.getElementById('txtIterations').textContent = `Núm. de iteración: ${iterations}`;

        for (let i = 0; i < 2; i++) { //A bucle for so the humans can move twice
            moveHumans();
            checkDistance();
            drawBoard();
            await delay(600);
        }

        for (let i = 0; i < 4; i++) { //A bucle for so the zombies can move 4 times
            moveZombies();
            checkDistance();
            drawBoard();
            await delay(600);
        }

        evaluateLife();

        //Saving the iteration requested data
        fileData += (`${iterations} | ${zombiesLeft.length} | ${humansLeft.length} | ${savedHumans}\n`);
    }

    //When there is no humans left, the file will be generated
    generateFile();
}

/**
 * Function to update the position of the humans
 */
const moveHumans = () => {
    //Clearing from the board all humans left to update their position later
    for (let row = 0; row <= 19; row++) {
        for (let col = 0; col <= 19; col++) {
            if (board[row][col] === 'H' || board[row][col] === 'I') {
                board[row][col] = 0;
            }
        }
    }

    //Remove the humans that arrived to the exit
    humansLeft.forEach((human, index) => {
        if (human.col === 19) {
            console.log(`Humano salvado en la casilla ${human.row}, ${human.col}`);

            humansLeft.splice(index, 1);
            savedHumans++;

            document.getElementById('txtSavedHumans').textContent = `Núm. de humanos salvados: ${savedHumans}`
        }
    })

    document.getElementById('txtHumansLeft').textContent = `Núm. de humanos en la oficina: ${humansLeft.length}`

    //Update the position of the humans left
    humansLeft.forEach(human => {
        if (human.row <= 10) {
            if (human.col <= 9) {
                if (board[human.row + 1][human.col + 1] === 0) {
                    human.row++;
                    human.col++;
                } else if (board[human.row + 1][human.col] === 0) {
                    human.row++;
                } else if (board[human.row][human.col + 1] === 0) {
                    human.col++;
                }
            } else {
                if (board[human.row + 1][human.col - 1] === 0) {
                    human.row++;
                    human.col--;
                } else if (board[human.row + 1][human.col] === 0) {
                    human.row++;
                } else if (board[human.row][human.col - 1] === 0) {
                    human.col--;
                }
            }
        } else {
            if (board[human.row + 1][human.col + 1] === 0) {
                human.row++;
                human.col++;
            } else if (board[human.row + 1][human.col] === 0) {
                human.row++;
            } else if (board[human.row][human.col + 1] === 0) {
                human.col++;
            }
        }

        if (human.infected) {
            board[human.row][human.col] = 'I';
        } else {
            board[human.row][human.col] = 'H';
        }
    });
}

/**
 * Function to update the position of the zombies
 */
const moveZombies = () => {
    //Clearing from the board all the zombies to update their position later
    for (let row = 0; row <= 19; row++) {
        for (let col = 0; col <= 19; col++) {
            if (board[row][col] === 'Z') {
                board[row][col] = 0;
            }
        }
    }

    //Set the zombies' new position
    zombiesLeft.forEach((zombie) => {
        let newPosition = zombie.moveZombie();
        while (board[newPosition[0]][newPosition[1]] !== 0) { //If the new position is occupied, set a new position
            newPosition = zombie.moveZombie();
        }

        //Set the zombie's new position
        zombie.prevPosition = zombie.position;
        zombie.position = newPosition;
        board[newPosition[0]][newPosition[1]] = 'Z';
    });
}

/**
 * Function to check if a human is next to a zombie
 */
const checkDistance = () => {
    humansLeft.forEach(human => {
        //If human is next to a zombie
        if (!human.infected && (board[human.row - 1][human.col - 1] === 'Z' || board[human.row - 1][human.col] === 'Z' || board[human.row - 1][human.col + 1] === 'Z' || board[human.row][human.col - 1] === 'Z' || board[human.row][human.col + 1] === 'Z' || board[human.row + 1][human.col - 1] === 'Z' || board[human.row + 1][human.col] === 'Z' || board[human.row + 1][human.col] === 'Z')) {
            human.infected = true;
            board[human.row][human.col] = 'I';
            console.log(`Humano infectado en la casilla ${human.row}, ${human.col}`);
        }
    });
}

/**
 * Function to evaluate the life of all the humans, also to convert a human to a new zombie
 * if his/her life reached zero
 */
const evaluateLife = () => {
    humansLeft.forEach((human, index) => {
        if (human.restLife() === 0) {
            board[human.row][human.col] = 'Z';
            zombiesLeft.push(new Zombie([human.row, human.col]));

            humansLeft.splice(index, 1);

            document.getElementById('txtHumansLeft').textContent = `Núm. de humanos en la oficina: ${humansLeft.length}`
            document.getElementById('txtNumZombies').textContent = `Núm. de zombies: ${zombiesLeft.length}`;
        }
    });
}

/**
 * Function to generate the txt file to save the requested information of all the iterations
 */
const generateFile = () => {
    fileData += ("-------------------------\n");
    fileData += ("No hay más humanos restantes, fin de las iteraciones");

    const element = document.createElement('a');

    const blob = new Blob([fileData], {
        type: 'plain/text'
    });

    const fileUrl = URL.createObjectURL(blob);
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', 'iteraciones.txt');

    element.style.display = 'none';
    element.click();
}

/**
 * Function to make the program stop for a certain number of miliseconds (useful to represent
 * the iterations in a visual way)
 * 
 * @param {Number} ms : The number of milliseconds that will be awaited
 */
const delay = ms => new Promise(res => setTimeout(res, ms));