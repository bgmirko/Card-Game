const initialState = {
    status: "not started",
    movements: 0
}

const reducer = ( state = initialState, action) => {
    if(action.type === 'START'){    
        return{
             ...state,
             status: "start",
             movements: 0
        }
    }
    if(action.type === 'RUN_GAME'){      
        return{
            ...state,
            status: "running"
        }
    }
    if(action.type === 'RESET'){      
        return{
            ...state,
            status: "reset",
            movements: 0
        }
    }
    if(action.type === 'ALL_FOUND'){
        return{
            ...state,
            status: "processing data"
        }
    }
    if(action.type === 'GAME_FINISHED'){
        return{
            ...state,
            status: "finished"
        }
    }
    if(action.type === 'PAUSED'){
        return{
            ...state, 
            status: "paused"
        }
    }
    if(action.type === 'INCREASE_MOVES'){
        return{
            ...state,
            movements: state.movements + 1
        }
    }
    return state;  
}


export default reducer;