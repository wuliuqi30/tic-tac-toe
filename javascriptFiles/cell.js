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
