import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

class Logout extends Component {

        componentDidMount(){
            this.props.onLogout();
            this.props.resetGameStatus();
            this.props.onLogoutResetResultsLocally();
        }

        render(){
            return(
                <Redirect  to="/"/>
            );
        }
}

const mapDispatchToProps = dispatch => {
    return{
        onLogout: () => dispatch(actions.logout()),
        resetGameStatus: () => dispatch(actions.resetGame()),
        onLogoutResetResultsLocally: () => dispatch(actions.onLogoutResetResultsLocally())
    }
};

export default connect(null, mapDispatchToProps)(Logout);