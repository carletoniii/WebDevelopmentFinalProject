import React from 'react';
import { Link } from 'react-router-dom';

function NavigationMenu() {
    return (
        <nav>
            <Link className='App-link' to="/">Homepage</Link>
            <Link className='App-link' to="/add-exercise">Add an exercise</Link>
        </nav>
    );
}

export default NavigationMenu;