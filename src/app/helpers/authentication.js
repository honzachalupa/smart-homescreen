import { _getCookie } from 'Helpers/browser';
import constants from './../constant-strings';

export function _isTestUser() {
    const { accessCode } = _getCookie('authentication');

    return accessCode === 66666 || accessCode === 99999;
}

// Určí, zdali je uživatel přihlášen a v opačném případě ho přesměruje na stránku přihlášení.
export function _checkAutheticationState(that) {
    const isAuthenticated = _getCookie('authentication').userNumber;

    if (!isAuthenticated) {
        that.props.history.push(constants.AUTH_URL);
    }
}
