import React, { Component } from 'react';
import { connect } from 'react-redux';

import MenuItem from './MenuItem/MenuItem';

import classes from './Menu.css';


class Menu extends Component {

    render() {
        return (
            <ul className={this.props.gameStatus === "running" || this.props.gameStatus === "paused" ? classes.Hide  : classes.Menu}>
                <MenuItem link="/">Game</MenuItem>
                <MenuItem link="/results">Results</MenuItem>
                {this.props.isAuthenticated
                ? <MenuItem link="/logout">Log Out</MenuItem>
                : <MenuItem link="/login">Log In</MenuItem>
                }
            </ul>
        )
    }

}

const mapStateToProps = state =>{
    return{
        isAuthenticated: state.auth.token !== null,
        gameStatus: state.gameStatus.status
    }
}

export default connect(mapStateToProps)(Menu);