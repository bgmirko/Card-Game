
const initialState = {
    results: [],
    userName: "Guest",
    userId: null,
    userBestTime: null,
    resultDbId: null,
    lastRoundResult: {
        time: null,
        moves: null,
        isLastResult: true
    },
    error: null
}

const reducer = (state = initialState, actions) => {

    if(actions.type === "ON_LOGOUT_RESET_RESULTS"){
        const lastRoundResult = {
            time: null,
            moves: null,
            isLastResult: false
        }
        return {
            ...state,
            lastRoundResult:{...lastRoundResult},
            userName: "Guest",
            userId: null,
            userBestTime: null,
            resultDbId: null,
            error: null
        }

    }

    if(actions.type === "SAVED_USER_IN_RESULT_DB"){
        const lastRoundResult = {
            time: null,
            moves: null,
            isLastResult: false
        }
        return {
            ...state,
            lastRoundResult:{...lastRoundResult},
            userBestTime: null,
            error: null
        }

    }
    if(actions.type === "SAVING_ERROR"){
        return{
            ...state,
            error: actions.error
        }
    }
    if(actions.type === "GET_RESULTS"){
        return{
            ...state,
            results: actions.results,
            error: null
        }
    }
    if(actions.type === "UPDATE_RESULT"){
        const lastRoundResult = {
            time: null,
            moves: null,       
            isLastResult: false
        }
        return{
            ...state,
            lastRoundResult: {...lastRoundResult},
            userBestTime: actions.time,
            resultDbId: actions.resultDbId,
            error: null
        }
    }
    if(actions.type === "GET_RESULTS_ERROR"){
        return{
            ...state,
            error: actions.error
        }
    }
    if(actions.type === "USER_BEST_TIME"){
        return{
            ...state,
            userBestTime: actions.time,
            resultDbId: actions.resultDbId,
            userName: actions.userName,
            userId: actions.userId
        }
    }
    if(actions.type === "SAVE_LAST_ROUND_LOCALLY"){
        const lastRoundResult = {
            time: actions.time,
            moves: actions.moves,
            isLastResult: true
        }
        return{
            ...state,
            error: null,
            lastRoundResult: {...lastRoundResult}   
        }
    }
    if(actions.type === "SAVE_USER_DATA_LOCALLY"){
        const lastRoundResult = {
            time: null,
            moves: null,
            isLastResult: false
        }
        return{
            ...state,
            lastRoundResult: {...lastRoundResult},
            userName: actions.userName,
            userId: actions.userId,
            userBestTime: actions.time,
            resultDbId: actions.resultDbId ? actions.resultDbId : state.resultDbId,
            error: null   
        }
    }
    if(actions.type === "SAVE_USER_DB_ID_LOCALLY"){
        return{
            ...state,
            resultDbId: actions.resultDbId
        }
    }
    return state;
}

export default reducer;