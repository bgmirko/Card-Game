import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../../store/actions/index';

import classes from './Timer.css';


class Timer extends Component {

    state = {
        min: "00",
        sec: "00",
        milisec: "00"
    }

    componentDidUpdate() {

        if (this.props.gameStatus.status === "start") {

            if (this.props.results.resultDbId === null && typeof this.props.results.results !== "undefined") {
                const userResult = this.props.results.results.find(el => {
                    return el.userId === this.props.auth.userId
                })
                if (typeof userResult !== "undefined") {
                    this.props.saveUserDbIdLocally(userResult.id);
                }
            }

            this.startWatch();
        }
        if (this.props.gameStatus.status === 'reset') {
            document.querySelector('#timer').innerHTML = "00:00:00";
        }
    }

    startWatch() {
        let sec = this.state.sec;
        let min = this.state.min;
        let milisec = this.state.milisec;
        if (min === "00") min = "0";
        if (sec === "00") sec = "0";

        const timer = () => {
            if (this.props.gameStatus.status === 'running' || this.props.gameStatus.status === 'start') {
                setTimeout(() => {
                    if (milisec === 99) {
                        milisec = 0;
                        sec++;
                    } else {
                        milisec++
                    }
                    if (sec === 60) {
                        sec = 0;
                        min++;
                    }
                    document.querySelector('#timer').innerHTML = formatNumb(min) + ":" + formatNumb(sec) + ":" + formatNumb(milisec);
                    timer();
                }, 10);
            } else if (this.props.gameStatus.status === "paused") {
                this.setState({ min: min, sec: sec, milisec: milisec });
            } else if (this.props.gameStatus.status === 'processing data') {
                const time = `${formatNumb(min)}:${formatNumb(sec)}:${formatNumb(milisec)}`;
                const moves = this.props.gameStatus.movements;

                // ako postoji prethodni rezultat koji je slabiji update ga sa novim boljim rezultatom
                if (this.props.auth.userId && (this.props.results.userBestTime > time || time === "empty")) {
                    this.props.updateResult(time, this.props.results.resultDbId, moves, this.props.auth.token);
                }

                // ako postoji prethodni rezultat koji je bolji od sadasnjeg
                if (this.props.auth.userId && this.props.results.userBestTime <= time) {
                    this.props.lastRoundResult(time, moves);
                }

                // ako je nelogovani Guest korisnik
                if (this.props.results.userName === "Guest") {
                    this.props.lastRoundResult(time, moves);
                }

                this.props.gameFinished();
                this.setState({ min: 0, sec: 0, milisec: 0 });

            } else if (this.props.gameStatus.status === 'reset') {
                document.querySelector('#timer').innerHTML = "00:00:00";
                this.setState({ min: "00", sec: "00", milisec: "00" });
            }
        }

        timer();

        function formatNumb(n) {
            return n < 10 ? "0" + n : n;
        }
    }

    render() {

        return (
            <div className={classes.Timer}>
                <label>Timer:</label>
                <label id="timer">{this.state.min}:{this.state.sec}:{this.state.milisec}</label>
            </div>
        )

    }

}

const mapStateToProps = state => {
    return {
        gameStatus: state.gameStatus,
        auth: state.auth,
        results: state.results
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // saveResultInDB: (result) => dispatch(actions.saveResultInDB(result)),
        updateResult: (time, resultDbId, moves, token) => dispatch(actions.updateResult(time, resultDbId, moves, token)),
        lastRoundResult: (time, moves) => dispatch(actions.lastRoundResult(time, moves)),
        resetGameeStatus: () => dispatch(actions.resetGame()),
        setUserBastTime: (time, resultDbId) => dispatch(actions.setUserBastTime(time, resultDbId)),
        gameFinished: () => dispatch(actions.gameFinished()),
        saveUserDbIdLocally: (resultDbId) => dispatch(actions.saveUserDbIdLocally(resultDbId))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Timer);