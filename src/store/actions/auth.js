import axios from 'axios';

export const authStart = () => {
    return {
        type: "AUTH_STARTS"
    }
}

export const authSuccess = (token, userId) => {
    return{
        type: "AUTH_SUCCESS",
        token: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return{
        type: "AUTH_FAIL",
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem('userId');
    localStorage.removeItem("User");
    localStorage.removeItem("Best time");
    localStorage.removeItem("DbId");
    return {
        type: "AUTH_LOGOUT"
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (email, password, isSignUp) => {
    return dispatch => { 
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        // za sing up new user
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBI6qPtbOXxbl0TpZwDTTGD5rno8q0XmvU";
        // verify password for old user
        if(!isSignUp){
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBI6qPtbOXxbl0TpZwDTTGD5rno8q0XmvU";
        }
        
        axios.post(url, authData)
            .then(response => {
                dispatch(authStart());
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                // pravi malu pauzu da bi se video spiner za ucitavanje, nije potrebno ali ajde stavio sam to radi fore
                setTimeout(() =>{
                    dispatch(authSuccess(response.data.idToken, response.data.localId));
                }, 500);
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));          
            });
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem("token");
        if(!token){
            dispatch(logout());
        }else {
            const expirationDate = new Date(localStorage.getItem("expirationDate"));
            if (expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }else{
                dispatch(logout());
            } 
        }
    };
};


