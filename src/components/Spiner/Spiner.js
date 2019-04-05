import React from 'react';

import classes from './Spiner.css';

const spiner = () => {
    
    return(
        <div className={classes.lds_roller}>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default spiner;