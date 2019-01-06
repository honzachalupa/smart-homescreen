import * as Sentry from '@sentry/browser';
import { _isTestEnvironment } from 'Helpers/environment';

const initialize = () => {
    if (navigator.onLine && _isTestEnvironment()) {
        Sentry.init({
            dsn: 'https://7c6e0fed76eb4f19aca8fe0d188cde9f@sentry.io/1340744'
        });
    }
};

export default {
    initialize
};
