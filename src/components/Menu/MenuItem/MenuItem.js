import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './MenuItem.css';

const menuItem = (props) => {

    return (
        <li className={classes.MenuItem}>
            <NavLink
                className={classes.MenuItem}
                activeClassName={classes.active}
                to={props.link}
                exact>
                {props.children}
            </NavLink>
        </li>
    )
}

export default menuItem;