/* globals __BASENAME__ */

import '@babel/polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import config from 'app-config';
import './App.scss';
import Page_Home from 'Pages/Home';
import Page_NotFound from 'Pages/NotFound';

export const AppContext = React.createContext();

class App extends Component {
    constructor() {
        super();

        this.updateContext = this.updateContext.bind(this);
        this.updateContextProperty = this.updateContextProperty.bind(this);

        this.state = {
            test: Math.random(),
            _updateContext: this.updateContext,
            _updateContextProperty: this.updateContextProperty
        };

        if (config.caching && config.caching.strategy) {
            this.initServiceWorker();
        }
    }

    /**
     * Initialization of SW used for caching (PWA requirement).
     *
     * @memberof App
     */
    initServiceWorker() {
        if ('serviceWorker' in navigator || 'caches' in window) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                const isServiceWorkerNotRegistered = regs.length === 0;

                if (isServiceWorkerNotRegistered) {
                    navigator.serviceWorker.register('sw.js', { scope: __BASENAME__ }).then(reg => {
                        console.log('Service worker successfully registered on scope:', reg.scope);

                        reg.onupdatefound = () => {
                            const installingWorker = reg.installing;

                            installingWorker.onstatechange = () => {
                                if (installingWorker.state === 'installed') {
                                    if (navigator.serviceWorker.controller) {
                                        this.setState({
                                            updateAvailable: true
                                        });
                                    } else {
                                        this.setState({
                                            updateAvailable: false
                                        });
                                    }
                                }
                            };
                        };
                    }).catch(error => {
                        console.log('Service worker failed to register: ', error);
                    });
                } else {
                    console.log('Service worker already registered.');
                }
            });
        }
    }

    /**
     * Performs an update of the global (App-level) context. Old state will be replaced with the new one.
     *
     * @param {any} context
     * @memberof App
     */
    updateContext(context) {
        this.setState(context);
    }

    /**
     * Performs an update of the global (App-level) context. Updates only selected item.
     *
     * @param {any} key
     * @param {any} value
     * @memberof App
     */
    updateContextProperty(key, value) {
        this.setState({
            [key]: value
        });
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                <Router basename={__BASENAME__}>
                    <Switch>
                        <Route component={Page_Home} path="/" exact />
                        <Route component={Page_NotFound} exact />
                    </Switch>
                </Router>
            </AppContext.Provider>
        );
    }
}

render(<App />, document.querySelector('#app'));
