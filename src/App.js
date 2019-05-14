import React from 'react';
import Provider from './context/';
import ThemeProvider from './features/ThemeProvider'
import Nav from './features/Nav';
import Main from './features/Main'

const App = () => {
    return (<Provider>
        <ThemeProvider>
            <Nav />
            <Main />
        </ThemeProvider>
    </Provider>);
};

export default App;
