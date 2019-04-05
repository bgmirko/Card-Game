export const startGame = () =>{
    return{
        type: 'START'
    };
};

export const runGame = () => {
    return{
        type: "RUN_GAME"
    };
};

export const resetGame = () => {
    return{
        type: "RESET"
    };
};

export const allFound = () => {
    return{
        type: "ALL_FOUND"
    }
}

export const gameFinished = () => {
    return{
        type: "GAME_FINISHED"
    }
}

export const gamePaused = () => {
    return{
        type: "PAUSED"
    }
}

export const increaseMoves = () => {
    return{
        type: "INCREASE_MOVES"
    }
}





