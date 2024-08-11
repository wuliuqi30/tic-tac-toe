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