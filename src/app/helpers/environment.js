/* globals __BUILDTARGET__, __BASENAME__ */

/**
 *
 *
 * @description Určí, zdali se jedná o lokální prostřědí (localhost).
 * @export
 * @returns
 */
export function _isDevEnvironment() {
    return __BUILDTARGET__ === 'dev';
}

// Určí, zdali se jedná o testovací prostřědí (https://nefa.softec.sk/nefa-dist/).
export function _isTestEnvironment() {
    return __BUILDTARGET__ === 'prod' && __BASENAME__ === '/nefa-dist/';
}

// Určí, zdali se jedná o produkční prostřědí (https://kalkulacka.cmss.cz/).
export function _isProdEnvironment() {
    return __BUILDTARGET__ === 'prod' && __BASENAME__ === '/';
}
