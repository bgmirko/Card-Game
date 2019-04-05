import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';

import * as actions from '../../store/actions/index';
import classes from './CardsBuilder.css';


class CardsBuilder extends Component {

    state = {
        cards: [],
        opened: 0,
        found: 0,
        checkForPair: true,
        canPlay: true,
        sound: true
    }

    componentWillReceiveProps(p) {
        if (p.sta === "start") {
            let cardsArray = this.createCards().map((el) => {
                el.status = 'closed';
                return el;
            });
            const url = require(`../../assets/sound/start.mp3`);
            this.playAudio(url);
            this.props.onRunGame();
            this.setState({ cards: cardsArray, opened: 0, found: 0 });
        } else if (p.sta === "reset") {
            let cardsArray = this.createCards().map((el) => {
                el.status = 'locked';
                return el;
            });
            this.setState({ cards: cardsArray, opened: 0, found: 0 });
        }

    }

    componentWillMount() {
        const cardsArray = this.createCards();
        this.setState({ cards: cardsArray, opened: 0, found: 0 });
    }

    componentDidMount() {
        if (this.props.sta !== "not started") {
            this.props.onResetGame();
        }
    }

    componentDidUpdate() {
        if (this.props.sta === "finished") {
            this.props.history.push({ pathname: "/results" });
        }
        if (this.state.opened === 2 && this.state.checkForPair) {
            this.checkForPair();
        }
    }

    createCards = () => {
        let cardsArray = [];
        let index = 0;

        // formira se array karata koje su poredjane po redu
        for (let i = 1; i <= 10; i++) {
            cardsArray[index] = {
                id: index,
                value: i,
                status: 'locked'
            }
            index++;
            cardsArray[index] = {
                id: index,
                value: i,
                status: 'locked'
            }
            index++;
        }
        let arrayLength = cardsArray.length;
        let tempElement;
        index = 0;
        let position;

        // random se mesaju karte 
        while (index < arrayLength) {
            position = Math.floor(Math.random() * arrayLength);
            tempElement = cardsArray[position];
            cardsArray[position] = cardsArray[index];
            cardsArray[index] = tempElement;
            index++;
        }

        return cardsArray;
    }

    startNewGame = () => {
        // ako je igra nije pocela treba poceti
        if (this.props.sta === "not started" || this.props.sta === "finished" || this.props.sta === "reset") {
            this.props.onStartGame();
        }

    }

    pauseGame = () => {
        if (this.props.sta === "paused") {
            // onda nastavi
            this.props.onStartGame();
        } else {
            // onda zaustavi
            this.props.onPaused();
        }
    }

    resetGame = () => {
        this.props.onResetGame();
    }

    switchSatusHandler = (id) => {
        if (this.state.canPlay && this.state.found < 10) {
            if (this.props.sta !== "paused") {
                let openedCards = this.state.opened;
                if (this.state.opened === 2) {
                    openedCards = 0;
                }
                if (this.state.opened !== 1 && this.props.sta !== "not started" && this.props.sta !== "reset") {
                    const url = require(`../../assets/sound/open.mp3`);
                    this.playAudio(url);
                }

                const cardsArray = this.state.cards.map(card => {
                    // ako su vec bile otvorene 2 karte 
                    // zatvori sve karte koje nisu uparene izuzev kliknute
                    if (this.state.opened === 2 && card.id !== id && card.status !== 'locked') {
                        card = { ...card, status: 'closed' };
                    }
                    // ako su bile otvorene 2 karte a ovo je kliknuta karta,
                    // ako je kliknuta karta bila zatvorena, otvara se
                    // ako je bila otvorena, zatvara se
                    if (this.state.opened === 2 && card.id === id && card.status !== 'locked') {
                        if (card.status === 'closed') {
                            card = { ...card, status: 'open' };
                            openedCards++;
                        } else {
                            card = { ...card, status: 'closed' };
                        }
                    }
                    // ako nije bilo otvorenih karata ili je bila jedna otvorena karta otvori kliknutu kartu ako je zatvorena
                    if (this.state.opened < 2 && card.id === id && card.status === 'closed' && card.status !== 'locked') {
                        card = { ...card, status: 'open' };
                        openedCards++;
                    }
                    return card;
                })
                let tempArray = cardsArray.map(el => {
                    return { ...el };
                })
                const canPlay = openedCards === 2 ? false : true;
                this.setState({ cards: tempArray, opened: openedCards, checkForPair: true, canPlay: canPlay });
            }
        }
    }

    checkForPair = () => {
        let cArray = [];
        let foundPairs = this.state.found;
        let opened;
        const twoOpenCards = [...this.state.cards].filter(element => element.status === 'open');
        const foundPairCards = twoOpenCards[0].value === twoOpenCards[1].value;
        if (foundPairCards) {
            cArray = this.state.cards.map((el) => {
                //uparene 2 karte zakljucati
                if (el.status === 'open') {
                    el = { ...el, status: 'locked' };
                    return el;
                } else return { ...el };
            });
            foundPairs++;
            opened = 0;
            if (foundPairs < 10) {
                const url = require(`../../assets/sound/pair.mp3`);
                this.playAudio(url);
            }
        } else {

            // ne radi nista
            cArray = [...this.state.cards];
            opened = 2;
            const url = require(`../../assets/sound/open.mp3`);
            this.playAudio(url);
        }
        if (foundPairs === 10) {
            const url = require(`../../assets/sound/end.mp3`);
            this.playAudio(url);
            this.setState({ found: 10 });
            this.props.onAllFound();
        } else {
            setTimeout(() => {
                this.props.increaseMove();
                this.setState({ cards: cArray, opened: opened, found: foundPairs, checkForPair: false, canPlay: true });
            }, 500);
        }
    }

    // sprecava da neko moze da kopoira ili prevuce sliku na poledjini karte
    preventDragHandler = (e) => {
        e.preventDefault();
    }

    playAudio(url) {
        if (this.state.sound) {
            let audio = new Audio(url);
            audio.play();
        }
    }

    swithcOnOffSound = () => {
        this.setState((prevState) => {
            return {
                sound: !prevState.sound
            }
        });
    }


    render(props) {

        const soundIcon = this.state.sound ? require(`../../assets/img/sound-on.png`) : require(`../../assets/img/sound-off.png`);

        return (
            <Auxiliary >
                <div className={classes.GamePanel}>
                    <div className={classes.CardsBuilder}>
                        {
                            this.state.cards.map((card) => {
                                return (
                                    <Card key={card.id}
                                        value={card.value}
                                        status={card.status}
                                        onDrag={this.preventDragHandler}
                                        click={() => this.switchSatusHandler(card.id)} />)
                            })
                        }
                    </div>
                    <div className={classes.ButtonTable}>
                        <label className={classes.User_Label}>{this.props.userName}</label>
                        <div className={classes.Buttons}>
                            <Button click={this.startNewGame}
                                disabled={this.props.sta !== "not started" &&
                                    this.props.sta !== "finished" &&
                                    this.props.sta !== "reset"}>Start</Button>
                            <Button click={this.pauseGame}
                                disabled={this.props.sta === "not started" ||
                                    this.props.sta === "finished" ||
                                    this.props.sta === "reset"}>{this.props.sta === "paused" ? "Continue" : "Pause"}</Button>
                            <Button click={this.resetGame}
                                disabled={this.props.sta === "not started" ||
                                    this.props.sta === "finished" ||
                                    this.props.sta === "reset"}>Reset</Button>
                            <input className={classes.SoundIcon} type="image" onClick={this.swithcOnOffSound} src={soundIcon} alt="sound" />
                        </div>
                    </div>
                </div>
            </Auxiliary>
        );
    }

}

const mapStateToProps = state => {
    return {
        sta: state.gameStatus.status,
        userName: state.results.userName
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onStartGame: () => dispatch(actions.startGame()),
        onRunGame: () => dispatch(actions.runGame()),
        onPaused: () => dispatch(actions.gamePaused()),
        onResetGame: () => dispatch(actions.resetGame()),
        onAllFound: () => dispatch(actions.allFound()),
        increaseMove: () => dispatch(actions.increaseMoves())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsBuilder);
