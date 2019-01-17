import React, { Component } from 'react';
import Chat from './Chat';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="webchat">
                <Chat />
            </div>
        );
    }
}

export default App;
