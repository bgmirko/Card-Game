import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

import CardsBuilder from './containers/CardsBuilder/CardsBuilder';
import Header from './components/Header/Header';
import Auth from './containers/Auth/Auth';
import Results from './components/Results/Results';
import Logout from './containers/Auth/Logout/Logout';

class App extends Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
        this.props.getResultsFromDataBase();
        if (localStorage.getItem("User") !== null) {
            const userId = localStorage.getItem("userId");
            const userName = localStorage.getItem("User");
            const DbId = localStorage.getItem("DbId");
            const time = localStorage.getItem("Best time");
            this.props.saveUserDataLocally(userId, userName, time, DbId);
        }
    }

    render() {

        return (
            <div>
                <Header />
                <Switch>
                    <Route path="/results" component={Results} />
                    <Route path="/login" component={Auth} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/" exact component={CardsBuilder} />
                    <Route component={CardsBuilder} />
                </Switch>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveUserDataLocally: (userId, userName, time, resultDbId) => dispatch(actions.saveUserDataLocally(userId, userName, time, resultDbId)),
        getResultsFromDataBase: () => dispatch(actions.getResults()),
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
};

export default withRouter(connect(null, mapDispatchToProps)(App));
