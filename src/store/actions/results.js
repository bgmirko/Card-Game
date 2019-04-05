import axios from 'axios';

export const onLogoutResetResultsLocally = () => {
    return {
        type: "ON_LOGOUT_RESET_RESULTS"
    }
}

export const getResults = (userId) => {
    return dispatch => {
        axios.get("https://memory-game-vega.firebaseio.com/results.json")
            .then(response => {
                const fetchedResults = [];
                for (let key in response.data) {
                    fetchedResults.push({
                        ...response.data[key],
                        id: key
                    });
                    if(response.data[key].userId === userId){
                        localStorage.setItem("DbId", key);
                    }
                }
                dispatch({type: "GET_RESULTS", results: fetchedResults});
            }).catch(error => {
                dispatch({type: "GET_RESULTS_ERROR", error: error});
            })
    };

};

export const setUserBastTime = (time, resultDbId, userName, userId) => {
     localStorage.setItem("Best time", time);
     localStorage.setItem("DbId", resultDbId);
     localStorage.setItem("User", userName);
     return{
        type: "USER_BEST_TIME",
        time: time,
        resultDbId: resultDbId,
        userName: userName,
        userId: userId
    }
}

export const updateResult = (t, resultDbId, moves, token) => {
    const data = `{"time":"${t}","moves":"${moves}"}`
    return dispatch => {
        axios.patch(`https://memory-game-vega.firebaseio.com/results/${resultDbId}/.json?auth=` +token, data)
            .then(response => {
                dispatch({type: "UPDATE_RESULT", time: t, resultDbId: resultDbId});
                dispatch(getResults());
            }).catch(error => {
                console.log(error);
            })
    }
}

export const lastRoundResult = (time, moves) => {
    return{
        type: "SAVE_LAST_ROUND_LOCALLY",
        time: time,
        moves: moves
    }

}

export const saveUserData = (userId, userName, time, token) => {  
    return dispatch => {
        const user = {
            userId: userId,
            userName: userName,
            time: time
        }
        axios.post("https://memory-game-vega.firebaseio.com/results.json?auth=" +token, user)
            .then(response => {
                dispatch(saveUserDataLocally(userId, userName, time))
                dispatch(getResults(user.userId));
            })
            .catch(error =>{
                dispatch({type: "SAVING_ERROR", error: error})
            });
    };
};

// resultDBid dobija samo iz App komponente iz ostalih pozivanja ne dobija
export const saveUserDataLocally = (userId, userName, time, resultDbId) => {
    localStorage.setItem("User", userName);
    localStorage.setItem("Best time", time);
    return{
        type: "SAVE_USER_DATA_LOCALLY",
        userId: userId,
        userName: userName, 
        time: time,
        resultDbId: resultDbId 
    }
}

export const saveUserDbIdLocally = (resultDbId) => {
    localStorage.setItem("DbId", resultDbId);
    return{
        type: "SAVE_USER_DB_ID_LOCALLY",
        resultDbId: resultDbId
    }
}
