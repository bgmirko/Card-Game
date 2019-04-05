const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
}

const reducer = (state = initialState, action) => {

    if(action.type === "AUTH_STARTS"){
        return{
            ...state,
            loading: true,
            error: null
        }
    }

    if(action.type === "AUTH_SUCCESS"){
        return{
            ...state,
            token: action.token,
            userId: action.userId,
            loading: false,
            error: null
        }
    }

    if(action.type === "AUTH_FAIL"){
        return{
            ...state,
            loading: false,
            error: action.error
        }
    }

    if(action.type === "AUTH_LOGOUT"){
        return{
            ...state,
            token: null,
            userId: null,
            userBestTime: null,
            error: null
        } 
    }
    return state;

}

export default reducer;