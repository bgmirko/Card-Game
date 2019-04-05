import React, { Component } from 'react';
import { connect } from 'react-redux';

import Timer from './Timer/Timer';
import Moves from './Moves/Moves';

import classes from './DisplayScore.css';

class  DisplayScore extends Component {

    
    render(){

        const classStack = this.props.gameStatus === "running"
        || this.props.gameStatus === "paused" 
        ? classes.DisplayScore : [classes.DisplayScore, classes.Hide].join(" ");

        return(
            <div className={classStack}>
                <Timer label="Time:"/> 
                <Moves/>
            </div>
        )
    }
}

const mapPropsToState = state => {
    return{
        gameStatus: state.gameStatus.status
    }
}

export default connect(mapPropsToState)(DisplayScore);