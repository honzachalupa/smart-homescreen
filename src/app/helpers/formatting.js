export function _camelize(text) {
    return text.replace(/^([A-Z])|[\s-]+(\w)/g, (match, p1, p2) => {
        if (p2) return p2.toUpperCase();

        return p1.toLowerCase();
    });
}

export function _decamelize(str, separator) {
    separator = typeof separator === 'undefined' ? '_' : separator;

    return str
        .replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`)
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, `$1${separator}$2`)
        .toLowerCase();
}

export function _formatValue(value, units) {
    if (units === 'currency') {
        return `${_addNumberSeparators(Math.round(value))} Kč`;
    } else if (units === 'years') {
        return `${value} ${_getUnit(value, units)}`;
    } else if (units === 'percents') {
        return `${_limitDecimals(value)}%`;
    } else if (units === 'boolean') {
        return value.toString() === 'true' ? 'Ano' : 'Ne';
    } else {
        throw new Error(`Unknown units: ${units}`);
    }
}

export function _getUnit(value, units) {
    if (units === 'years') {
        if (value === 1) {
            return 'rok';
        } else if (value > 1 && value < 2) {
            return 'roku';
        } else if (value >= 2 && value < 5) {
            return 'roky';
        } else {
            return 'let';
        }
    } else if (units === 'adults') {
        if (value === 1) {
            return 'dospělý';
        } else if (value >= 2 && value <= 4) {
            return 'dospělí';
        } else {
            return 'dospělých';
        }
    } else if (units === 'childrens') {
        if (value === 1) {
            return 'dítě';
        } else if (value >= 2 && value < 5) {
            return 'děti';
        } else if (value >= 5) {
            return 'dětí';
        }
    }

    return '';
}

/**
 *
 *
 * @description Přidá desetinou čárku a mezery pro zobrazení číselných výsledků.
 * @export
 * @param {any} value
 * @returns
 */
export function _addNumberSeparators(value) {
    const isNaN = Number.isNaN(value);
    const isNegative = value < 0;

    value = Math.round(value * 100) / 100;

    if (!isNaN) {
        const numbers = value.toString().replace('-', '').replace('.', ',').split('');
        numbers.reverse();

        const formatedArray = [];

        let i = 1;
        numbers.forEach(number => {
            formatedArray.push(number);

            if (i % 3 === 0) {
                formatedArray.push(' ');
            }

            i += 1;
        });

        let formated = isNegative ? '-' : '';
        formated += formatedArray.reverse().join('').trim();

        return formated;
    } else {
        return '-';
    }
}

/**
 *
 *
 * @description Omezí počet zobrazovaných desetiných čísel pro zobrazení číselných výsledků.
 * @export
 * @param {any} value
 * @param {number} [decimalsCount=2]
 * @returns
 */
export function _limitDecimals(value, decimalsCount = 2) {
    const afterDotCount = 10 ** decimalsCount;

    return (Math.round(value * afterDotCount) / afterDotCount).toString().replace('.', ',');
}

export function _removeZeros(value) {
    return value.replace(/0+/g, '');
}

export function _boolToLabel(value) {
    if (value.toString() === 'true') {
        return 'Ano';
    } else {
        return 'Ne';
    }
}
