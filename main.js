const GAME_SIZE = 4;
let currentTable = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

const keyCodes = {
    KeyLeft:    37, // stanga
    KeyUp:      38, // sus
    KeyRight:   39, // dreapta
    KeyDown:    40, // jos  
};

window.addEventListener("load", () => {
    generateRandomTile();
    generateRandomTile();

    window.addEventListener("keydown", (event) => {
        let moved = false;
        switch (event.key) {
            case 'ArrowUp':
            case 'w': { // fortz
                for (let i = 1; i < GAME_SIZE; ++i) {
                    for (let j = 0; j < GAME_SIZE; ++j) {
                        if (currentTable[i][j]) {
                            moved = move(i, j, {i: -1, j: 0}) || moved;
                        }
                    }
                }
                break;
            }
            case 'ArrowDown':
            case 's': {
                for (let i = GAME_SIZE - 1; i >= 0; --i) {
                    for (let j = 0; j < GAME_SIZE; ++j) {
                        if (currentTable[i][j]) {
                            moved = move(i, j, {i: 1, j: 0}) || moved;
                        }
                    }
                }
                break;
            }
            case 'ArrowLeft':
            case 'a': {
                for (let j = 1; j < GAME_SIZE; ++j) {
                    for (let i = 0; i < GAME_SIZE; ++i) {
                        if (currentTable[i][j]) {
                            moved = move(i, j, {i: 0, j: -1}) || moved;
                        }
                    }
                }
                break;
            }
            case 'ArrowRight':
            case 'd': {
                for (let j = GAME_SIZE - 1; j >= 0; --j) {
                    for (let i = 0; i < GAME_SIZE; ++i) {
                        if (currentTable[i][j]) {
                            moved = move(i, j, {i: 0, j: 1}) || moved;
                        }
                    }
                }
                break;
            }
        }

        if (moved) {
            generateRandomTile();
            if (checkLost()) {
                document.write("praf mai esti smr");
            }
        }
    });
});

const executeMove = (from, to) => {
    const [i, j] = from;
    const [x, y] = to;
    
    if (currentTable[x][y] === null) {
        currentTable[x][y] = currentTable[i][j];
    } else if (currentTable[x][y] === currentTable[i][j]) {
        currentTable[x][y] *= 2;
    } else return;
    currentTable[i][j] = null;
    updateTable();
}

const move = (i, j, direction) => {
    let moved = false;
    while (canMoveValue(currentTable[i][j], i + direction.i, j + direction.j)) {
        executeMove([i, j], [i + direction.i, j + direction.j]);
        i += direction.i;
        j += direction.j;
        moved = true;
    }
    return moved;
}

const canMoveValue = (value, i, j) => {
    if (typeof currentTable[i] == "undefined") 
        return false;
    if (typeof currentTable[j] === "undefined") 
        return false;   
    if (currentTable[i][j] !== null && currentTable[i][j] !== value)
        return false;
    return true;
}

const updateTable = () => {
    for (const row in currentTable) {
        for (const col in currentTable[row]) {
            const value = currentTable[row][col];
            const element = document.getElementById(`tile-${row}-${col}`);

            element.classList.remove("is-2");
            element.classList.remove("is-4");
            element.classList.remove("is-8");
            element.classList.remove("is-16");
            element.classList.remove("is-32");
            element.classList.remove("is-64");
            element.classList.remove("is-128");
            element.classList.remove("is-256");
            element.classList.remove("is-512");
            element.classList.remove("is-1024");
            element.classList.remove("is-2048");

            if (value === null) {
                element.innerHTML = "";
            } else {
                element.innerHTML = value;
                element.classList.add(`is-${value}`);
            }
        }
    }
}

const generateRandomTile = () => {
    let i;
    let j;
    do {
        i = Math.floor(Math.random() * GAME_SIZE);
        j = Math.floor(Math.random() * GAME_SIZE);
    } while (currentTable[i][j] !== null);

    if (Math.random() * 100 < 70) {
        currentTable[i][j] = 2;
    } else {        
        currentTable[i][j] = 4;
    }

    updateTable();
}

const checkLost = () => {
    for (const i in currentTable) {
        for (const j in currentTable[i]) {
            if (currentTable[i][j] === null)
                return false;
            if (typeof currentTable[i + 1] !== "undefined") {
                if (currentTable[i][j] == currentTable[i + 1][j]) {
                    return false;
                }
            }
            if (typeof currentTable[i][j + 1] !== "undefined") {
                if (currentTable[i][j] == currentTable[i][j + 1]) {
                    return false;
                }
            }
        }
    }

    return true;
}