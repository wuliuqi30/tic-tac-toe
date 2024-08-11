// Main DOM Elements
const body = document.querySelector("body");
const formSection = document.querySelector(".new-game-form-section");
const gameInfoSection = document.querySelector(".game-info-section");
const gameContainerSection = document.querySelector(".game-container-section");

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

        // Input Player Names
        const formTitleNames = document.createElement("h1");
        formTitleNames.textContent = "Choose Player Names:";
        newGameForm.appendChild(formTitleNames);

        const inputNameRow1 = document.createElement("div");
        inputNameRow1.classList.add("inputNameRow");

        const name1Label = document.createElement("label")
        name1Label.setAttribute("for","name1")
        name1Label.textContent = "Player 1's Name:"
        inputNameRow1.appendChild(name1Label);
        
        
        const name1 = document.createElement("input");
        name1.setAttribute("id", "name1");
        name1.setAttribute("type", "text");
        name1.setAttribute("name","player-1-name");
        name1.value = "Player 1";
        name1.required = true;
        inputNameRow1.appendChild(name1);

        newGameForm.appendChild(inputNameRow1);


        const inputNameRow2 = document.createElement("div");
        inputNameRow2.classList.add("inputNameRow");

        const name2Label = document.createElement("label")
        name2Label.setAttribute("for","name2")
        name2Label.textContent = "Player 2's Name:"
        inputNameRow2.appendChild(name2Label);
        
        
        const name2 = document.createElement("input");
        name2.setAttribute("id", "name2");
        name2.setAttribute("type", "text");
        name2.setAttribute("name","player-2-name");
        name2.required = true;
        name2.value = "Player 2";
        inputNameRow2.appendChild(name2);

        newGameForm.appendChild(inputNameRow2);


        // Title
        const formTitle = document.createElement("h1");
        formTitle.textContent = "Choose Player 1's Marker:";
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
        const restartButton = document.createElement("button");
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