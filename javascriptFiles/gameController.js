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
        const playerRadioLabels = formSection.querySelectorAll('.radio-button-text');
        const playerNames = formSection.querySelectorAll('input[type="text"]');
        let player1Marker;
        let player2Marker; 

        if (marker.value === "x"){
            player1Marker = "X";
            player2Marker = "O";
        } else {
            player1Marker = "O";
            player2Marker = "X";
        }
        return [Player(playerNames[0].value, 1, player1Marker),
        Player(playerNames[1].value, 2, player2Marker)]
    };

    const players = getPlayersFromForm();

    const getPlayerList = () => {
        for (let p = 0; p < players.length; p++) {
            players[p].displayInfo();
        }
    }

    const getFirstPlayer = () => {
        return players[0];
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