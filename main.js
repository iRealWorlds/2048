const GAME_SIZE = 4;
let currentTable = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];
let blacklist = [];
let score = 0, gameLost = false;

window.addEventListener("load", () => {
    startGame();
    loadSavedGame();

    document.getElementById("restart-button").addEventListener("click", event => {
        event.preventDefault();
        startGame();
        localStorage.removeItem("saved_game");
    });

    window.addEventListener("keydown", (event) => {
        if (!gameLost) {
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
                blacklist = [];
                updateTable();
                saveGame();
                if (checkLost()) {
                    const high = localStorage.getItem("high_score") ?? 0;
                    if (score > high) {
                        setHighScore(score);
                    }
                    gameLost = true;
                    localStorage.removeItem("saved_game");
                    alert("Game lost");
                }
            }
        }
    });
});

const saveGame = () => {
    localStorage.setItem("saved_game", JSON.stringify({
        score,
        currentTable,
        blacklist
    }));
}

const loadSavedGame = () => {
    const data = JSON.parse(localStorage.getItem("saved_game"));
    if (data) {
        startGame();
        addScore(data.score);
        currentTable = data.currentTable;
        blacklist = data.blacklist;
        updateTable();
    }
}

const startGame = () => {
    currentTable = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ];
    blacklist = [];
    addScore(-score);
    gameLost = false;
    
    document.getElementById("bestScore").innerHTML = localStorage.getItem("high_score") ?? 0;

    generateRandomTile();
    generateRandomTile();
}

const executeMove = (from, to) => {
    const [i, j] = from;
    const [x, y] = to;
    
    if (currentTable[x][y] === null) {
        currentTable[x][y] = currentTable[i][j];
    } else if (currentTable[x][y] === currentTable[i][j]) {
        currentTable[x][y] *= 2;
        addScore(currentTable[x][y]);
        blacklist.push(JSON.stringify([x, y]));
    } else return;
    currentTable[i][j] = null;
}

const move = (i, j, direction) => {
    let moved = false;
    while (canMoveValue({i, j}, {i: i + direction.i, j: j + direction.j})) {
        executeMove([i, j], [i + direction.i, j + direction.j]);
        i += direction.i;
        j += direction.j;
        moved = true;
    }
    return moved;
}

const canMoveValue = (from, to) => {
    if (blacklist.includes(JSON.stringify([from.i, from.j])))
        return false;
    if (blacklist.includes(JSON.stringify([to.i, to.j])))
        return false;
    if (typeof currentTable[to.i] == "undefined") 
        return false;
    if (typeof currentTable[to.j] === "undefined") 
        return false;   
    if (currentTable[to.i][to.j] !== null && currentTable[to.i][to.j] !== currentTable[from.i][from.j])
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

const addScore = add => {
    score += add;
    document.getElementById("currentScore").innerHTML = score;
}

const setHighScore = score => {
    localStorage.setItem("high_score", score);
    document.getElementById("bestScore").innerHTML = score;
}