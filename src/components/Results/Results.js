import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import Result from './Result/Result';

import classes from './Results.css';

class Results extends Component {

    componentWillMount() {
       if(this.props.results.results.length === 0){
            this.getResults();
       }
    }

    componentDidMount() {
        const elem = document.getElementById("focus");  
        if(elem){
            elem.scrollIntoView(true);  
        }  
    }

    getResults = (props) => {
        this.props.getResultsFromDataBase(this.props.results.userId);
    }

    render() {
       
        const unSortedResultList = [...this.props.results.results];

        // ako postoji poslednji rezultat u reduceru dodaj taj rezultat nizu rezultata koji su prethodno ucitani iz baze
        // poslednji rezultat u reduceru ce postojati jedino ako je slabiji od rezultata u bazi ili ako je Guest account
        // tom poslednjem rezultatu se dodaje obelezivac za markiranje markResult a ostale vrednost ce dobiti tu vrednost false
        // ako ne postoji poslednji rezulat u reduceru znaci u prethodnoj igri Gost ili Registrovan user postigao je najbolji rezultat
        // tom rezultatu se dodaje markResult true a ostalim elementima za taj proprty false 
        if(this.props.results.lastRoundResult.time !== null){
            const lastRoundResult = {
                ...this.props.results.lastRoundResult,
                userName: this.props.results.userName,
                markResult: true,
                id: "Guest"
            };
            unSortedResultList.map(el => {
                el.markResult = false;
                return el;
            })
            unSortedResultList.push({...lastRoundResult});
        }else{
            unSortedResultList.map(el => {
                if(el.userId === this.props.results.userId){
                    el.markResult = true;
                }else{
                    el.markResult = false;
                }
                return el;
            })
        }

        // sortiranje rezultata po vremenu, uzlazno
        const sortedResultsList = [...unSortedResultList].sort(function(a, b){
            if(a.time < b.time){return -1;}
            if(a.time > b.time){return 1;}
            return 0;
        });

        let iterator = 1;

        let resultList = sortedResultsList.map((el) => {
            if(el.time!=="empty"){
                return <Result key={el.id}
                position = {iterator++}
                userName={el.userName}
                time={el.time}
                moves={el.moves} 
                markResult={el.markResult}/>
            }else return null;        
        });

        return (
            <div className={classes.Results}>
                <h1>Results</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Position</th>
                            <th>User</th>
                            <th>Time</th>
                            <th>Moves</th>
                        </tr>
                        {resultList}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        results: state.results,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getResultsFromDataBase: () => dispatch(actions.getResults())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);