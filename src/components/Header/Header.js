import React from 'react';

import DisplayScore from './DisplayScore/DisplayScore';
import Menu from '../Menu/Menu';

import classes from './Header.css';

const header = () => {

    return (
        <header className={classes.Header}>
            <div className={classes.Score}>
                <DisplayScore />
            </div>
            <nav>
                <Menu />
            </nav>
        </header>
    )
}

export default header;