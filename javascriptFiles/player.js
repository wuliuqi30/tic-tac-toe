function Player(name, idIn, playerLabelIn) {
    let playerName = name;
    let id = idIn;
    let numGamesWon = 0;
    let playerLabel = playerLabelIn; // This is the symbol that will go into their box when checked.

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