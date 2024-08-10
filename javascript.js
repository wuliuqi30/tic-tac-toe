// Main DOM Elements
const body = document.querySelector("body");
const formSection = document.querySelector(".new-game-form-section");
const gameInfoSection = document.querySelector(".game-info-section");
const gameContainerSection = document.querySelector(".game-container-section");


// The Game Board
function ticTacToeBoard() {

    const rows = 3;
    const columns = 3;
    const board = [];
    let numMoves = 0;


    // Create the board as an array of arrays:
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        }
    }

    // Is this row/column pair a valid spot to play?
    const validLocation = (r, c) => {
        return (r > -1) && (r < rows) && (c > -1) && (c < columns);
    }

    // Convert the board with objects to a pure array with numbers:
    const getBoardWithCellValues = () => {
        return board.map((row) => row.map((cell) => cell.readVal()));
    }

    // Display the board (console game version only)
    const printBoard = () => {
        console.table(getBoardWithCellValues());

    }

    // Place your marker at the location row m, column n on the board
    const placeMarker = (m, n, marker) => {

        numMoves++;


        if (!validLocation(m, n)) {
            console.log(`Please play between 0 and ${rows - 1}`);
            return false;
        }



        const thisCell = board[m][n]; // This works because thisCell is a pointer


        if (!thisCell.readVal()) {
            thisCell.setVal(marker); // This works because thisCell is a pointer, board[m][n] is actually updated
            return true;
        } else {
            console.log("A player already played here!");
            return false;
        }
    }


    const isThreeInARow = (marker, threeArray) => {
        // Check if threeArray is three of a marker in a row
        return threeArray.every(num => num === marker);
    }


    const winningConfigurationExistsFor = (playerId) => {
        // Returns true if a winning configuration exists on the board, false otherwise. For this playerId (the cell value of the board cells is null or one ofthe player ids)
        const cellBoard = getBoardWithCellValues();

        // check each row
        for (let r = 0; r < rows; r++) {
            if (isThreeInARow(playerId, cellBoard[r])) {
                return true;
            }
            // check each column of this row:
            for (let c = 0; c < columns; c++) {
                if (isThreeInARow(playerId, [cellBoard[0][c], cellBoard[1][c], cellBoard[2][c]])) {
                    return true;
                }
            }
        }

        // check diagonals
        if (isThreeInARow(playerId, [cellBoard[0][0], cellBoard[1][1], cellBoard[2][2]])
            || isThreeInARow(playerId, [cellBoard[2][0], cellBoard[1][1], cellBoard[0][2]])) {
            return true;
        }

    }

    const tie = () => {
        // For now, just check that the board is full.
        return numMoves > 8;
    }

    return { printBoard, placeMarker, winningConfigurationExistsFor, tie };

};


// Each unit of the game board:
function Cell() {
    // empty is null
    let cellVal = null;

    const setVal = (value) => {
        cellVal = value;
    };

    const readVal = () => {
        return cellVal;
    }

    return { setVal, readVal };
}


function Player(name, idIn, playerLabelIn) {
    let playerName = name;
    let id = idIn;
    let numGamesWon = 0;
    let playerLabel = playerLabelIn;

    const getName = () => {
        return playerName;
    }

    const getId = () => {
        return id;
    }

    const getLabel = () => {
        // corresponds to the DOM label element's "for" field
        return playerLabel;
    }

    const displayInfo = () => {
        console.log(`${playerName}, id: ${id}`);
    }

    // This is not currently being used.
    const incrementNumberOfGamesWon = () => {
        numGamesWon++;
    }

    // This is not currently being used.
    const getNumberOfGamesWon = () => {
        return numGamesWon;
    }

    return { getName, getId, getLabel, displayInfo };

}


function GameController(
    playerOneName = "X",
    playerTwoName = "O"
) {

    let thereIsAWinner = false;
    let gameOver = false;

    const isGameOver = () => {
        return gameOver;
    }

    // This is the information about whose turn it is that is on top of the board.
    let displayInfo = '';
    const getDisplayInfo = () => {
        return displayInfo;
    }

    // Get the marker of the first player
    const marker = formSection.querySelector('input[name="playermarker"]:checked');

    // Get Player List from Input Form from the start menu:
    const getPlayersFromForm = () => {
        const playerNames = formSection.querySelectorAll('.radio-button-text');
        return [Player(playerNames[0].textContent, 1, playerNames[0].getAttribute("for")),
        Player(playerNames[1].textContent, 2, playerNames[1].getAttribute("for"))]
    };

    const players = getPlayersFromForm();

    const getPlayerList = () => {
        for (let p = 0; p < players.length; p++) {
            players[p].displayInfo();
        }
    }

    const getFirstPlayer = () => {
        return players.find((el) => el.getLabel() === marker.id);
    }

    // Choose a first player
    let currentPlayer = getFirstPlayer();

    const nextPlayer = () => {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    // Delete the start menu's form contents because we've gotten the data from it already
    let child = formSection.lastElementChild;
    while (child) {
        formSection.removeChild(child);
        child = formSection.lastElementChild;
    }


    // Make the board
    let board = ticTacToeBoard();

    const viewBoard = () => {
        board.printBoard();
    }

    // Information about the round to do in to the top display
    const printNewRound = () => {
        //board.printBoard();
        displayInfo = `${currentPlayer.getName()}'s turn.`;
        console.log(displayInfo);
    }

    // Defines a function: takeTurn(n,m) : based on whose turn it is, put your player marker down onto the board
    const takeTurn = (m, n) => {

        let placeMarkerSuccess = board.placeMarker(m, n, currentPlayer.getId());

        // Check for winning conditions

        for (let p = 0; p < 2; p++) {
            if (board.winningConfigurationExistsFor(players[p].getId())) {
                thereIsAWinner = true;
                board.printBoard();
                displayInfo = `${players[p].getName()} wins!`;
                console.log(displayInfo);
                gameOver = true;
                return;
            }
        }

        // Check for ties
        if (board.tie()) {
            thereIsAWinner = false;
            board.printBoard();
            displayInfo = `Tie!`;
            console.log(displayInfo);
            gameOver = true;
            return;

        }


        if (placeMarkerSuccess) {
            nextPlayer();
            printNewRound();
        }

    }


    const restartGame = () => {
        // Get a new board.
        board = ticTacToeBoard();
        currentPlayer = getFirstPlayer();
        thereIsAWinner = false;
        displayController.goToStartMenu();
        printNewRound();
    }

    // Initial Round Info: 
    printNewRound();



    return { takeTurn, getPlayerList, getCurrentPlayer, viewBoard, isGameOver, getDisplayInfo, restartGame };
};


// We just need one display controller, so make it an IIFE:
const displayController = (function () {

    const deleteGameDisplay = () => {
        // Delete the game container's contents
        let child = gameContainerSection.lastElementChild;
        while (child) {
            gameContainerSection.removeChild(child);
            child = gameContainerSection.lastElementChild;
        }
    }

    // Create the start menu below the header
    const goToStartMenu = () => {

        // Reset if we were just playing a game.
        deleteGameDisplay();
        gameDisplayInfo.textContent = "";

        // Create the form to start the game
        const newGameForm = document.createElement("form");
        // Title
        const formTitle = document.createElement("h1");
        formTitle.textContent = "Choose Player:";
        newGameForm.appendChild(formTitle);

        // Radio Button
        const selectPlayerContainer = document.createElement("div");
        selectPlayerContainer.classList.add("select-player-container")

        // X
        const radioButtonX = document.createElement("input");
        radioButtonX.classList.add("radio-button");
        radioButtonX.setAttribute("type", "radio");
        radioButtonX.setAttribute("id", "x");
        radioButtonX.setAttribute("name", "playermarker");
        radioButtonX.setAttribute("value", "x");
        radioButtonX.checked = true;
        selectPlayerContainer.appendChild(radioButtonX);

        const radioButtonLabelX = document.createElement("label");
        radioButtonLabelX.classList.add("radio-button-text");
        radioButtonLabelX.setAttribute("for", "x");
        radioButtonLabelX.textContent = "X";

        selectPlayerContainer.appendChild(radioButtonLabelX);

        newGameForm.appendChild(selectPlayerContainer);

        // O
        const radioButtonO = document.createElement("input");
        radioButtonO.setAttribute("type", "radio");
        radioButtonO.classList.add("radio-button");
        radioButtonO.setAttribute("id", "o");
        radioButtonO.setAttribute("name", "playermarker");
        radioButtonO.setAttribute("value", "o");
        selectPlayerContainer.appendChild(radioButtonO);

        const radioButtonLabelO = document.createElement("label");
        radioButtonLabelO.classList.add("radio-button-text");
        radioButtonLabelO.setAttribute("for", "o");
        radioButtonLabelO.textContent = "O";

        selectPlayerContainer.appendChild(radioButtonLabelO);

        newGameForm.appendChild(selectPlayerContainer);

        // Start Button
        const submitButton = document.createElement("button");
        submitButton.classList.add("submit");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = "Start!";
        newGameForm.appendChild(submitButton);

        formSection.appendChild(newGameForm);


        newGameForm.addEventListener("submit", (event) => {
            event.preventDefault();
            initializeGame();
            //runTestFunction(true);
        })

    }



   
    const gameDisplayInfo = document.createElement("p");

    // Delete the start menu and display the game board based on which player was selected to start
    const initializeGame = () => {

        // Create the display text box inside of gameInfoSection
        gameDisplayInfo.textContent = "";
        gameInfoSection.appendChild(gameDisplayInfo);

        // Create the board DOM elements as a grid:
        const gameBoardDOMContainer = document.createElement("div");
        gameBoardDOMContainer.classList.add('tic-tac-toe-board');
        gameContainerSection.appendChild(gameBoardDOMContainer);

        // Create the board on the screen.
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const cellDOM = document.createElement("button");
                cellDOM.classList.add("cell");
                cellDOM.textContent = "";
                gameBoardDOMContainer.appendChild(cellDOM);

                // Each Cell needs an event listener which then will call takeTurn
                cellDOM.addEventListener("click", (event) => {
                    const thisPlayer = game.getCurrentPlayer();
                    game.takeTurn(r, c);
                    // If successful, then put the player's mark on the board:
                    cellDOM.textContent = thisPlayer.getLabel();
                    // Once its been clicked, its disabled now.
                    cellDOM.disabled = true;

                    // If the game is over, disable all buttons and create the restart button.
                    if (game.isGameOver()) {
                        // Disable clicking action on the buttons

                        allCells = document.querySelectorAll(".cell");

                        allCells.forEach((button) => {
                            button.disabled = true;
                        })


                    }
                    // Put game information from last turn into the display
                    gameDisplayInfo.textContent = game.getDisplayInfo();

                })
            }
        }

        // Create the restart button that can be clicked at any time
        restartButton = document.createElement("button");
        restartButton.classList.add("restart-button")
        restartButton.textContent = "Restart Game";
        gameContainerSection.appendChild(restartButton);

        restartButton.addEventListener("click", (event) => {
            game.restartGame();
        })

        // Create a new Game.
        const game = GameController();
        gameDisplayInfo.textContent = game.getDisplayInfo();

    }

    goToStartMenu();

    return { initializeGame, goToStartMenu }
})();




// Testing stuff:
// Run the game automatically: 
function runTestFunction(runTheTest) {
    if (runTheTest) {
        const game = GameController();
        const { takeTurn, getPlayerList, getCurrentPlayer, viewBoard } = game;

        console.log("Running Test");
        // Check first column:
        takeTurn(0, 0);
        takeTurn(0, 1);
        takeTurn(1, 0);
        takeTurn(0, 2);
        console.log("Expected output: Play 1 wins? Won 1 game so far?")
        takeTurn(2, 0);

        // // Check second row: 
        // takeTurn(1, 0);
        // takeTurn(0, 1);
        // takeTurn(1, 1);
        // takeTurn(0, 2);
        // console.log("Expected output: Play 1 wins? Won 2 games so far?")
        // takeTurn(1, 2);

        // // Check player 2 third column
        // takeTurn(1, 0);
        // takeTurn(0, 2);
        // takeTurn(1, 1);
        // takeTurn(1, 2);
        // takeTurn(2, 0);
        // console.log("Expected output: Play 2 wins? Won 1 games so far?")
        // takeTurn(2, 2);


        // // Check diagonals: 
        // // Check player 2 diagonal
        // takeTurn(1, 0);
        // takeTurn(0, 0);
        // takeTurn(1, 2);
        // takeTurn(1, 1);
        // takeTurn(2, 0);
        // console.log("Expected output: Play 2 wins? Won 2 games so far?")
        // takeTurn(2, 2);


        // // Check ties
        // takeTurn(0, 0);
        // takeTurn(0, 1);
        // takeTurn(0, 2);
        // takeTurn(1, 0);
        // takeTurn(1, 2);
        // takeTurn(1, 1);
        // takeTurn(2, 1);
        // takeTurn(2, 2);
        // console.log("Expected output: Tie")
        // takeTurn(2, 0);
    }
}