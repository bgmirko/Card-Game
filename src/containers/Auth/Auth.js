import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../components/Button/Button';

import * as actions from '../../store/actions/index';
import Spiner from '../../components/Spiner/Spiner';
import Input from '../../components/Input/Input';
import classes from './Auth.css';

class Auth extends Component {

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
            userName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'User Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false,
                errorMessage: ""
            }
        },
        isSignup: true,
        typingTimer: null
    }

    componentWillReceiveProps(p) {
        // ako je korisnik ulogovan iz svih rezultata pronalazi se njegov rezultat ako postoji i belezi se izdvojeno u Results reducer
        if (p.results.userBestTime === null && p.results.results && p.auth.userId && p.results.userName === "Guest") {
            const userResult = [...p.results.results].find(el => {
                return el.userId === p.auth.userId
            })
            if (typeof userResult !== "undefined") {
                // ako je korisnik ulogovan i u rezultatima vec postoji njegov rezultat igre ucitava se taj rezultat i snima lokalno
                const resultDbId = userResult.id;
                const userBestTime = userResult.time;
                this.props.userBastTime(userBestTime, resultDbId, userResult.userName, userResult.userId);
            } else if (typeof userResult === "undefined" && p.auth.token !== null && p.results.error === null) {
                this.props.saveUserData(p.auth.userId, this.state.controls.userName.value, "empty", p.auth.token);
            }
        }
        if (p.auth.userId && typeof p.auth.resultDbId === "undefined" && localStorage.getItem("DbId")) {
            this.props.saveUserDbIdLocally(localStorage.getItem("DbId"));
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup }
        });
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({ controls: updatedControls });
    }


    checkUsernameExist = (event) => {
        let typingTimer = this.state.typingTimer;
        clearTimeout(typingTimer);
        if (event.target.value) {
            typingTimer = setTimeout(this.doneTyping, 2000);
            this.setState({ typingTimer: typingTimer })
        }
    }

    // Baca error ako user name posoji u bazi
    doneTyping = () => {
        let errorMessage = "";
        // proverava da li postoji element koji ima isti user name
        const exist = this.props.results.results.find(el => {
            return el.userName === this.state.controls.userName.value;
        });
        if (exist) { errorMessage = "User Exist" } else { errorMessage = "" }
        const updatedControls = {
            ...this.state.controls,
            userName: {
                ...this.state.controls.userName,
                valid: !(errorMessage.length > 0),
                errorMessage: errorMessage
            }
        };
        this.setState({ controls: updatedControls });
    }

    onSubmitForm = (event) => {
        event.preventDefault();

        //ako je neki korisnik vec logovan izloguj ga i resetuj data, mada ovo mi ne teba ali za svaki slucaj
        if (this.props.auth.token) {
            this.props.logout();  
        }

        this.props.resetGameStatus();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    render() {

        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => {
            if (this.state.isSignup || (!this.state.isSignup && formElement.id !== "userName")) {
                return (<Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    errorMsg={formElement.config.errorMessage}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    keyUp={formElement.id === "userName" ? (event) => this.checkUsernameExist(event) : null} />);
            } else {
                return null;
            }


        });

        if (this.props.auth.loading === true) {
            form = <Spiner />
        }

        let errorMessage = null;

        if (this.props.auth.error) {
            errorMessage = (
                <p>{this.props.auth.error.message}</p>
            )
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to="/" />
        }

        return (

            <div className={classes.Auth}>
                <div className={classes.Auth_Box}>
                    {authRedirect}
                    {errorMessage}
                    <form onSubmit={this.onSubmitForm}>
                        {form}
                        <Button>{this.state.isSignup ? "Sing Up" : "Sing In"}</Button>
                    </form>
                    <Button click={this.switchAuthModeHandler}
                        classN="Link">{this.state.isSignup ? "Sing In" : "Sing Up"}</Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        results: state.results,
        isAuthenticated: state.auth.token != null
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => {
            dispatch(actions.auth(email, password, isSignUp));
            dispatch(actions.onLogoutResetResultsLocally());
        },
        saveUserData: (userId, userName, time, token) => dispatch(actions.saveUserData(userId, userName, time, token)),
        getResultsFromDataBase: () => dispatch(actions.getResults()),
        userBastTime: (userBastTime, resultDbId, userName, userId) => dispatch(actions.setUserBastTime(userBastTime, resultDbId, userName, userId)),
        resetGameStatus: () => dispatch(actions.resetGame()),
        logout: () => dispatch(actions.logout()),
        // saveUserDatabaseIdLocally: (resultDbId) => dispatch(actions.saveUserDatabaseIdLocally(resultDbId)),
        saveUserDbIdLocally: (resultDbId) => dispatch(actions.saveUserDbIdLocally(resultDbId)),
        // saveUserDataLocaly: (userId, userName) => dispatch(actions.saveUserDataLocaly(userId, userName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);