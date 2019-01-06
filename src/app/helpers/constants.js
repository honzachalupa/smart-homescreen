import { _isInvalid, _isNumber } from 'Helpers/data';
import constantStrings from './../constant-strings';

export default async function getConstants() {
    return {
        ...constantStrings,
        config: await getConfig(),
        types: await getTypes(),
        volumeDiscounts: await getVolumeDiscounts(),
        crossSellDiscounts: await getCrossSellDiscounts(),
        ratings: await getRatings(),
        tariffs: await getTariffs(),
        LTVs: await getLTVs(),
        otherConstants: await getSolvencyConstants(),
        expensesPerPerson: await getExpensesPerPerson(),
        expensesPerCountry: await getExpensesPerCountry(),
        ageCoefficients: await getAgeCoefficients()
    };
}

// Config
export async function getConfig() {
    return _loadConstants('config', 'rows-basic', false, null);
}

// Loan
async function getTypes() {
    const keys = [
        'rate',
        'MU',
        'discountVolume',
        'ratingTopUp',
        'dosporovani',
        'discountCS',
        'lowIncomeTopUp',
        'minRate',
        'stamps',
        'MUinstallmentToBonita',
        'maxAmount'
    ];

    return _loadConstants('loan-types', 'rows', true, [null, ...keys]);
}

async function getVolumeDiscounts() {
    const keys = [
        'a_Percents',
        'b_Percents',
        'c_Percents'
    ];

    return _loadConstants('loan-volume-discounts', 'rows', false, [null, ...keys]);
}

async function getCrossSellDiscounts() {
    const keys = [
        'withSecurity',
        'withoutSecurity'
    ];

    return _loadConstants('loan-cs-discounts', 'rows', true, [null, ...keys]);
}

async function getRatings() {
    const keys = [
        'a_Percents',
        'b_Percents',
        'c_Percents'
    ];

    return _loadConstants('loan-ratings', 'rows', false, [null, ...keys]);
}

async function getTariffs() {
    const keys = [
        'dosporovani',
        'payment',
        'years'
    ];

    return _loadConstants('loan-tariffs', 'rows', true, [null, ...keys]);
}

async function getLTVs() {
    return _loadConstants('loan-ltv', 'rows-basic', false);
}

// Solvency
async function getSolvencyConstants() {
    return _loadConstants('solvency', 'rows-basic', false);
}

async function getExpensesPerPerson() {
    return _loadConstants('solvency-expenses-per-person', 'rows-basic', false);
}

async function getExpensesPerCountry() {
    const keys = [
        'label',
        'value'
    ];

    return _loadConstants('solvency-expenses-per-country', 'rows', true, [null, ...keys]);
}

// Risk Life Insurance
async function getAgeCoefficients() {
    return _loadConstants('rzp-age-coefficients', 'rows-basic', true);
}


// Načítání dat z CSV souborů.
export async function _loadConstants(fileName, layout, hasHeader, defaultKeys = [], notCachedVersion = false) {
    const lineEndSymbol = '#line-end';

    if (fileName && layout && !_isInvalid(hasHeader)) {
        const cacheHelper =
            navigator.onLine ?
                (
                    notCachedVersion ?
                        `?${Math.random()}` :
                        ''
                ) : '';

        const promise = fetch(`./constants/${fileName}.csv${cacheHelper}`).then((response) => {
            return response.text();
        }).then((contentRaw) => {
            const constants = {};
            const content = contentRaw.replace(/\r\n|\r|\n/g, lineEndSymbol).replace(new RegExp(`${lineEndSymbol}$`), '');
            let lines = content.split(lineEndSymbol);

            if (layout === 'rows') {
                if (hasHeader) {
                    lines = lines.slice(1);
                }

                lines.forEach((line) => {
                    const elements = line.split(';');
                    const key = elements[0];
                    const props = {};

                    elements.forEach((prop, i) => {
                        if (!_isInvalid(defaultKeys[i])) {
                            props[defaultKeys[i] || i] = safeNumber(prop);
                        }
                    });

                    constants[key] = props;
                });
            } else if (layout === 'rows-basic') {
                if (hasHeader) {
                    lines = lines.slice(1);
                }

                lines.forEach((line) => {
                    const elements = line.split(';');
                    const key = elements[0];
                    const prop = elements[1];

                    constants[key] = safeNumber(prop);
                });
            } else if (layout === 'columns') {
                throw new Error('Layout "columns" is not defined.');
            } else if (layout === 'columns-simple') {
                const keys = defaultKeys || lines[0].split(';');

                keys.forEach(key => {
                    constants[key] = [];
                });

                lines.slice(1).forEach((line) => {
                    const elements = line.split(';');

                    elements.forEach((prop, i) => {
                        if (prop !== '') {
                            constants[keys[i]].push(safeNumber(prop));
                        }
                    });
                });
            }

            return Promise.resolve(constants);
        }).catch((error) => {
            return Promise.reject(error);
        });

        return promise;
    } else {
        throw new Error('Properties fileName, layout and hasHeader are mandatory.');
    }
}

function safeNumber(stringNumber) {
    return _isNumber(stringNumber) ? parseFloat(stringNumber.replace(',', '.')) : stringNumber;
}
