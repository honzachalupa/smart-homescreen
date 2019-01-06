/* global __BASENAME__ */

import immutabilityHelper from 'immutability-helper';
import GoogleAnalytics from 'Helpers/google-analytics';
import constants from './../constant-strings';
import { _isInvalid } from 'Helpers/data';
import { _checkAutheticationState } from 'Helpers/authentication';

// Registrace service-workeru, který se stará o cacheování a je základní podmínkou Progressive Web App.
export function _initServiceWorker() {
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

export function _removeCachedData() {
    if (navigator.onLine) {
        if ('caches' in window) {
            caches.keys().then(cacheKeys => {
                cacheKeys.forEach(cacheName => {
                    caches.delete(cacheName);

                    console.log('Cache removed.');
                });
            }).then(() => {
                navigator.serviceWorker.getRegistrations()
                    .then(registrations => {
                        registrations.forEach(registration => {
                            registration.unregister();

                            console.log('Service worker unregistered.');
                        });
                    });

                window.location.reload(true);
            });
        } else {
            console.log('Service worker - Unable to clear the cache.');
        }
    } else {
        const message = 'Pro update aplikace se prosím přípojte k internetu a poté akci zopakujte.';

        this.setState({
            isMessageShown: true,
            messageBoxContent: message
        });
    }
}

export function _setDefaultValues(controlsDefinition, defaultValues) {
    const output = {};
    Object.entries(controlsDefinition).forEach(entry => {
        const group = {
            id: entry[0],
            controls: entry[1]
        };

        output[group.id] = group.controls.map(control => {
            control.value = defaultValues[control.id];

            return control;
        });
    });

    return output;
}

let firstTimeLoad = true;
let originUrl = null;
let analyticsOff = false;
/**
 *
 *
 * @description Fuknce používaná v React life-cycle u většiny stránek.
 * @export
 */
export function _onComponentDidMount(shouldGatherValues = true) {
    const { history, _updateContext } = this.props;

    _checkAutheticationState(this);

    if (shouldGatherValues) {
        this.gatherValuesFromControlsDefinition();
    }

    if (firstTimeLoad) {
        const interval = 500;
        firstTimeLoad = false;
        analyticsOff = true;

        _updateContext('isLoading', true);

        if (originUrl === null) {
            originUrl = window.location.pathname.match(/(\/[a-z-]*)$/g)[0];
        }

        const urlsToBeLooped = [
            constants.SAVING_URL,
            constants.LOAN_URL,
            constants.SOLVENCY_URL,
            constants.RZP_URL
        ].filter(url => url !== originUrl);

        urlsToBeLooped.push(originUrl);

        /* eslint-disable prefer-arrow-callback, func-names */
        for (let i = 0; i < urlsToBeLooped.length; i += 1) {
            (index => {
                setTimeout(function() { // Must be ES5 function!
                    const url = urlsToBeLooped[index];

                    _updateContext('isLoading', true);

                    history.push(url);
                }, interval + (interval * i));
            })(i);
        }
        /* eslint-enable */

        setTimeout(() => {
            _updateContext('isLoading', false);

            analyticsOff = false;
        }, interval + (interval * urlsToBeLooped.length));
    }

    if (!analyticsOff) {
        GoogleAnalytics.logPageView();
    }
}

/**
 *
 *
 * @description Update data-setu pro danou stránku.
 * @export
 * @param {any} id
 * @param {any} value
 * @param {any} controlsDefinitionId
 */
export function _updateControlsDefinition(id, value, controlsDefinitionId) {
    const { controlsDefinition } = this.state;

    const originalControlsDefinition = controlsDefinition[controlsDefinitionId];
    const updatedControlsDefinition = originalControlsDefinition.map((record) => {
        if (record.id === id) {
            return { ...record, value };
        }

        return record;
    });

    this.setState({
        controlsDefinition: immutabilityHelper(controlsDefinition, {
            $merge: {
                [controlsDefinitionId]: updatedControlsDefinition
            }
        })
    });
}

/**
 *
 *
 * @description Vytěží hodnoty z data-setu.
 * @export
 */
export function _gatherValuesFromControlsDefinition() {
    const { controlsDefinition } = this.state;
    const unitedControlsDefinition = {};

    Object.keys(controlsDefinition).forEach(controlsDefinitionKey => {
        controlsDefinition[controlsDefinitionKey].forEach(control => {
            const { id, value } = control;

            unitedControlsDefinition[id] = !_isInvalid(value) ? value : null;
        });
    });

    this.setState({
        unitedControlsDefinition
    });
}

// Najde objekt z data-setu na základě ID objektu.
export function _getControl(controlsDefinition, controlId) {
    return controlsDefinition.find(control => control.id === controlId);
}

export function _getSelectLabel(optionId, options) {
    return options.find(option => option.id === optionId).label;
}

export function _getSavedValues(...controlsDefinitions) {
    const savedValues = {};

    controlsDefinitions.forEach(definition => {
        if (!_isInvalid(definition) && Object.keys(definition).length > 0) {
            Object.keys(definition).forEach(definitionId => {
                definition[definitionId].forEach((control) => {
                    savedValues[control.id] = control.value;
                });
            });
        }
    });

    return savedValues;
}
