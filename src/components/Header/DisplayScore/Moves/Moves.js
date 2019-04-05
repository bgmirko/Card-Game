import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Moves.css';

class Moves extends Component{

    render(props){
        return(
            <div className={classes.Moves}>
                <label>Moves:</label>
                <label>{this.props.moves}</label>
            </div>
        );
    }  
}

const mapStateToProps = state =>{
    return{
        moves: state.gameStatus.movements
    }
}

export default connect(mapStateToProps)(Moves);